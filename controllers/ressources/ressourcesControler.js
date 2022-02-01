const express =  require('express');  
let db = require("../../db/models/index")
const sequelize = require('sequelize')
const fs = require("fs");
const router = express.Router();
const path = require("path");
const { suid } = require('rand-token');
const { Op } = require("sequelize");
const Feedback = db.Feedback
const Images = db.Images
const Ressources_docs = db.Ressources_docs

/**
 * This route return all user data profile and the numbers of incomplete fields.
 */

router.post('/checkExist', async (req,res) =>{

  try {

    const ressource = await db.Ressources.findOne({
      where: {
        name: {
          [Op.like]: `%${req.body.name}%`
        }
      }
    })
    
    if(ressource === null){

      res.status(200).send({
        exist: false
      })

    } else {

      res.status(409).send({
        message: "Oups !!! Il y a déjà une ressource qui porte ce nom en BDD !!!!",
        type: "error"
      })
    }

  } catch (error) {
    console.log(error)
    res.status(500).send({

        message: {
          message: "Oups !!! je n'ai pas put vérifier si une ressource portais déja le même nom !",
          desc: error.toString(),
          type: 'error'
        }

      })
  }

})

router.post('/get', async (req, res) =>{

  let noData = false
  let ressourcesCount = await db.Ressources.count()
  const settings = await db.appSettings.findAll()


  const limitBDD = settings[0].dbStorageLimit
  const limitServer = settings[0].storageLimitServer

  const logos = await  db.Images.findAll({
    attributes: [
        [sequelize.fn('OCTET_LENGTH', sequelize.col('image')), 'imageSize']
      ]
  })
  const docSize = await db.Ressources.sum('file_size', {where: {type: 'docs'}})
  const appsSize = await db.Ressources.sum('file_size', {where: {type: 'apps_file'}}) 
  let logoSizeMB = 0

  if(logos.length !== 0){

    logoSizeMB = (logos[0].dataValues.logosSize/1024)/1024

  }

  const totalSizeBDD = logoSizeMB + docSize

  const totalSizeServer = appsSize/1024

  const percentBDD = (totalSizeBDD * 100)/limitBDD
  const percentServer = (totalSizeServer * 100)/limitServer

  const size = {
    percentBDD: percentBDD.toFixed(3),
    percentServer: percentServer.toFixed(3),
    totalSizeBDD: totalSizeBDD.toFixed(3),
    totalSizeServer: totalSizeServer.toFixed(3),
    limitBDD: limitBDD,
    limitServer: limitServer
  }

  db.Ressources.findAll({
    order: [['createdDate','DESC']],
    offset: req.body.offset, 
    limit: req.body.limit
  }).then(ressources =>{
    let osDispinibility = []
    if(ressources.length === 0){
      noData = true
    }

    Promise.all( ressources.map((ressource) =>{

      if(ressource.macOSX === true){

        osDispinibility.push("macOSX")

      }
      if (ressource.windows === true){

        osDispinibility.push("windows")

      }
      if(ressource.linux === true){
      
        osDispinibility.push("linux")

      }

      delete ressource.dataValues.macOSX
      delete ressource.dataValues.windows
      delete ressource.dataValues.linux

      ressource.dataValues.osDisponibility = osDispinibility
    }))
    res.status(200).send({
      list: ressources,
      count: ressourcesCount,
      size: size,
      noData: noData
    })
  }).catch((err) =>{
      console.log("err => ",err)  
      res.status(401).send({

        message: {
          message: 'impossible de charger la liste contacter votre administrateur réseau',
          type: 'error'
        }

      })
  })

})

router.post('/getRessource', async (req, res) =>{

  let noFeedback = false
  const feedbacksCount = await db.Feedback.count({where: {RessourceId: req.body.id}})
  const feedbacksSum = await db.Feedback.sum('rate',{where: {RessourceId: req.body.id}})
  const feedBackAVG = feedbacksSum/feedbacksCount
  db.Ressources.findOne({
      where:{
        id: req.body.id
      },
      include: [{
          model: Feedback,
          as: 'Feedbacks',
          required: false,
          where : {RessourceId: req.body.id}
        },
        {
          model: Logo,
          as: 'Logo',
          required: true,
          where : {RessourceId: req.body.id}
        },
        {
          model: Ressources_docs,
          // as: 'Ressource_doc',
          required: false,
          where: {RessourceId: req.body.id}
        }
      ]
  })
  .then(async (response) =>{

      const buff = response.Logo.logo.toString('base64')
      response.Logo.logo = "data:"+response.Logo.mime_type+";base64,"+buff

      const osDispinibility = []

      if(response.macOSX === true){

        osDispinibility.push("macOSX")

      }
      if (response.windows === true){

        osDispinibility.push("windows")

      }
      if(response.linux === true){
      
        osDispinibility.push("linux")

      }

      if(response.Feedbacks){

        if(response.Feedbacks.length <= 0){
          noFeedback = true
        }

      }
      response.dataValues.osDisponibility = osDispinibility
      res.status(200).send({
        ressource: response.dataValues,
        feedbacks: response.dataValues.Feedbacks,
        feedbacksCount: feedbacksCount,
        average: feedBackAVG,
        noFeedback: noFeedback
      })
  }).catch((err) => {
      console.log(err)

       res.status(401).send({

        message: {
          message: 'impossible de charger le projet contacter votre administrateur réseau',
          type: 'error'
        }

      })
    })
})

router.post('/get_with_type', async (req, res) =>{

  let noData = false
  const data = req.body.data
  const dataType = data.dataType
  let visibility = []
  
  switch (data.visibility) {
    case "admin":

      visibility = [{visibility: "Admin"},{visibility: "User"},{visibility: "Public"}]
      break;
    case "iut_staff":
      visibility = [{visibility: "User"},{visibility: "Public"}]

      break;
    case "user":
      visibility = [{visibility: "Public"}]
      break;
    default:
      visibility = [{visibility: "Public"}]
      break;
  }


  let ressourcesCount = await db.Ressources.count()
  let buff
  let logo = {}

  db.Ressources.findAll({
    order: [['createdDate','DESC']],
    where: dataType === "apps" ? {[Op.or]: [{ type: "apps_file" }, { type: "apps_link" }], [Op.and]: {[Op.or]: visibility}}: {type: dataType, [Op.and]: {[Op.or]: visibility}},
    include: db.Images
  }).then(async (ressources) =>{
    if(ressources.length === 0){
      noData = true
    }
    await Promise.all(ressources.map(async (ressource) =>{

      const osDispinibility = []

      const feedbacksCount = await db.Feedback.count({where: {RessourceId: ressource.id}})
      const feedbacksSum = await db.Feedback.sum('rate',{where: {RessourceId: ressource.id}})
      const feedBackAVG = feedbacksSum/feedbacksCount
      buff = ressource.Logo.logo.toString('base64')
      logo = `data:${ressource.Logo.mime_type};base64,`+buff

      delete ressource.dataValues.Logos
      ressource.dataValues.logo = logo

      switch (ressource.type) {
        case "apps_link":
            ressource.dataValues.displayType = "Application"
          break;
        case "apps_file": 
            ressource.dataValues.displayType = "Application"
          break;
        case "online_service":
            ressource.dataValues.displayType = "Service en ligne"
          break;
        case "docs": 
            ressource.dataValues.displayType = "Procédure"
          break;
        default:
            ressource.dataValues.displayType = "n/c"
          break;
      }

      if(ressource.macOSX === true){

        osDispinibility.push("macOSX")

      }
      if (ressource.windows === true){

        osDispinibility.push("windows")

      }
      if(ressource.linux === true){
      
        osDispinibility.push("linux")

      }

      delete ressource.dataValues.macOSX
      delete ressource.dataValues.windows
      delete ressource.dataValues.linux

      ressource.dataValues.osDispinibility = osDispinibility
      ressource.dataValues.average = feedBackAVG
    }))
    res.status(200).send({
      listType: ressources,
      count: ressourcesCount,
      noData: noData
    })
  }).catch((err) =>{
      console.log("err => ",err)  
      res.status(401).send({

        message: {
          message: 'impossible de charger la liste contacter votre administrateur réseau',
          type: 'error'
        }

      })
  })

})

router.post('/delete', async (req, res) =>{

    try {
    const data = req.body.data
    const ressources_docs = await db.Ressources_docs.findAll({where: {RessourceId: data.itemIDS}})

    const date = new Date()
    const dateNow = date.toLocaleString()

    if(ressources_docs){

      await Promise.all(ressources_docs.map(async (ressource_doc) =>{

        const docIDS = await db.Ressources_docs.findAll({where: {DocId: ressource_doc.DocId}})

        if(docIDS){

          await Promise.all(docIDS.map(async (doc) =>{
          
            const ressources =  await db.Ressources.findAll({where: {id: doc.RessourceId}})

            if(ressources){
              
              await Promise.all(ressources.map(async (ressource) =>{
                if(ressource.id === doc.RessourceId){
                  ressource.set({
                    has_procedure: false,
                    updatedDate: dateNow
                  })
                  await ressource.save()

                }

              }))

              await db.Docs.destroy({where: {id: doc.DocId}})

            } else {
              await db.Docs.destroy({where: {id: doc.DocId}})

            }
          }))
        }

      }))
    }

    await db.Ressources.destroy({
      where: {id: data.itemIDS}
    })

    if(data.ressourcesLength - data.itemIDS.length === 0 && data.offset >=10){
      data.offset = data.offset - 10
      data.currentPage = data.currentPage - 1
    }

    const count = data.count - data.itemIDS.length
  
    const ressources = await db.Ressources.findAll({
    
      offset: data.offset,
      limit: 10
    })

    await Promise.all(ressources.map(async (ressource) =>{

      const osDispinibility = []

      switch (ressource.type) {
        case "apps_link":
            ressource.dataValues.displayType = "Application"
          break;
        case "apps_file": 
            ressource.dataValues.displayType = "Application"
          break;
        case "online_service":
            ressource.dataValues.displayType = "Service en ligne"
          break;
        case "docs": 
            ressource.dataValues.displayType = "Procédure"
          break;
        default:
            ressource.dataValues.displayType = "n/c"
          break;
      }

      if(ressource.macOSX === true){

        osDispinibility.push("macOSX")

      }
      if (ressource.windows === true){

        osDispinibility.push("windows")

      }
      if(ressource.linux === true){
      
        osDispinibility.push("linux")

      }

      delete ressource.dataValues.macOSX
      delete ressource.dataValues.windows
      delete ressource.dataValues.linux

      ressource.dataValues.osDispinibility = osDispinibility
    }))
   
    res.status(200).send({
        ressources: ressources,
        count: count,
        currentPage: data.currentPage,
        message: {
          message: "le(s) ressources ont bien été supprimé !",
          type: "success"
        }
      })
  } catch (error) {
    console.log('error in /delete  =====> ', error)
    res.status(500).send({

      message: {
        message: "Oups ! je n'ai pas pu supprimer le(s) item(s) séléctionné(s) ",
        type: 'error'
      }
    })
  }

})

router.post('/create_ressource', async (req,res) =>{

  const data = req.body.data

  const date = new Date()
  let macOSX = false
  let linux = false
  let windows = false

  try {

    if(data.type === "apps_file" || data.type === "apps_link"){
      await data.osDisponibility.forEach(os => {
        switch (os) {
          case "macOSX":
            macOSX = true
            break;
          case "linux":
            linux = true
            break;
          case "windows":
            windows = true
            break;  
          default:
            break;
        }
      });
    }
    await db.Ressources.create({
      key: data.uid,
      name: data.name,
      is_essential: data.is_essential,
      describ: data.describ,
      createdDate: date.toLocaleString(),
      type: data.type,
      visibility: data.visibility,
      macOSX: macOSX,
      linux: linux,
      windows: windows,  
    })

    res.status(201).send({
      status: "success"
    })
  } catch (error) {
    console.log(error)

    res.status(500).send({
      message: "Oups ! Je n'ai pas pu créer la ressource en BDD",
      desc: error.toString(),
      type: "error"
    })
  }

})

// router.post('/new',async (req, res)=> {

//   const data = req.body.data
//   let has_procedure = false
//   let size = null
//   let fileName = null 
//   let link = null
 

//   if(data.file){
//     fileName = data.file[0].name
//     size = (data.file[0].size /1024)/1024
//   } else if(data.docs){
//     fileName = data.docs[0].name
//     size = (data.docs[0].size /1024)/1024
//   } else {
//     link = data.link
//   }

//   if(data.have_doc_associated === true){
  
//     has_procedure = true
//   }

//   const newRessource = {

//     }
//   try {
//     const ressource = await db.Ressources.create({newRessource})
    
//     if(data.have_doc_associated === true || data.type === "docs"){

//       let docs_path = ''
//       let docs_name = ''
//       let size = 0
//       let Doc = {}

//       if(data.type === "docs"){
//         docs_path = `/Ressources_uploaded/Temporary_docs/${data.docs[0].name}`
//       } else if(data.have_doc_associated === true){
      
//         size = (data.doc_associated[0].size /1024)/1024
//         docs_path = `/Ressources_uploaded/Temporary_docs/${data.doc_associated[0].name}`
//         docs_name = data.doc_associated[0].name
//       }


//       let newDoc = {
//         key: suid(16),
//         has_procedure: false,
//         name: `${data.name} - Procédure`,
//         file_name: docs_name,
//         file_size: size,
//         describ: data.describ,
//         createdDate: date.toLocaleString(),
//         type: "docs",
//         visibility: data.visibility,
//         macOSX: false,
//         linux: false,
//         windows: false,  
//       }

//         if(data.have_doc_associated === true){

//           await db.Logo.create({
//             name: data.logo[0].name,
//             logo: fs.readFileSync(
//               path.join(process.cwd(), `/public/${data.logo[0].name}`)
//             ),
//             mime_type: data.logo[0].type,
//             RessourceId: Doc.id,
//           })
//           .then((image) => {
//             fs.writeFileSync(
//               path.join(process.cwd(), `/public/${data.logo[0].name}`),
//               image.logo
//             );
//           })
//         }
        
//           if(data.have_doc_associated === true){
//             await db.Ressources_docs.create({RessourceId: Doc.id, DocId: file.id})
//             await db.Ressources_docs.create({RessourceId: ressource.id, DocId: file.id})

//           } else {

//             await db.Ressources_docs.create({RessourceId: ressource.id, DocId: file.id})

//           }
//           await db.Logo.create({
//             name: data.logo[0].name,
//             logo: fs.readFileSync(
//               path.join(process.cwd(), `/public/${data.logo[0].name}`)
//             ),
//             mime_type: data.logo[0].type,
//             RessourceId: ressource.id,
//           })
//           .then((image) => {
//             fs.writeFileSync(
//               path.join(process.cwd(), `/public/${data.logo[0].name}`),
//               image.logo
//             );
//             res.status(201).send({
//               message: "La ressource à bien été créée !!!!!",
//               type: "success"
//             })    
//           })

//           if(data.type === "docs"){

            

//           } else {
          
//             fs.unlinkSync(
//               path.join(process.cwd(), `/Ressources_uploaded/Temporary_docs/${data.doc_associated[0].name}`)
//             )          

//           }

//         })
//     } else {

//       await db.Logo.create({
//         name: data.logo[0].name,
//         logo: fs.readFileSync(
//           path.join(process.cwd(), `/public/${data.logo[0].name}`)
//         ),
//         mime_type: data.logo[0].type,
//         RessourceId: object.id,
//       })
//       .then((image) => {
//         fs.writeFileSync(
//           path.join(process.cwd(), `/public/${data.logo[0].name}`),
//           image.logo
//         );
//         res.status(201).send({
//           message: "La ressource à bien été créée !!!!!",
//           type: "success"
//         })    
//       })
//     }
    
//   } catch (error) {

//     console.log(error)
//     let err = ""

//     if(error.original){

//       err = `Erreur sql : ${error.original.sqlMessage}`

//     } else if (error.code) {

//       err = "il y a eu un problème lors de l'écriture du logo en BDD"

//     }

//   }
// })

router.post('/update', async (req,res) =>{

  const data = req.body.data
  let logo = {}
  let file = {}
  let values = data.values
  let ressource_logo = {}
  let doc = {}
  let isLink = false

  if(values.isLink){
    isLink = values.isLink
  }

  values.macOSX = false
  values.linux = false
  values.windows = false

  const date = new Date()
  const dateNow = date.toLocaleString()

  values.updatedDate = dateNow

  const fields = {
    newLogo: false,
    newFile: false,
    link: false
  }

  if(values.newLogo){
    fields.newLogo = true
    logo = data.logo
  }

  if(values.newFile){
    fields.newFile = true
    file = data.file
    values.file_name = file.name
    values.file_size = (file.size/1024)/1024
  }

  if(values.isLink){
    fields.link = true
  }
  console.log(values)
   if(values.type === "apps_file" && isLink === false ){
    await values.osDisponibility.forEach(os => {
      switch (os) {
        case "macOSX":
          values.macOSX = true
          break;
        case "linux":
          values.linux = true
          break;
        case "windows":
          values.windows = true
          break;  
        default:
          break;
      }
    });
  }

  try {

    const ressource = await db.Ressources.findOne({
      where:{id: data.id},
      include: [{
          model: Logos,
          as: 'Logos',
          required: true,
          where : {RessourceId: data.id}
        },
        {
          model: Ressources_docs,
          // as: 'Ressource_doc',
          required: false,
          where: {RessourceId: data.id}
        }
      ]
    })
    switch (true) {

      case (fields.newFile === true && fields.newLogo === true):

        ressource.set(values)
        await ressource.save()

        ressource_Images = await db.Images.findOne({where:{id: ressource.Logos[0].id}})
        ressource_Images.set({
          name: logo.name,
          logo: fs.readFileSync(
            path.join(process.cwd(), `/public/${logo.name}`)
          ),
          mime_type: logo.type
        })

        await ressource_logo.save()
        .then((image) => {
          fs.writeFileSync(
            path.join(process.cwd(), `/public/${logo.name}`),
            image.logo
          )
        })
        doc = await db.Docs.findOne({where: {id: ressource.Ressources_doc.DocId}})

        doc.set({
          file: fs.readFileSync(
            path.join(process.cwd(), `/Ressources_uploaded/Temporary_docs/${file.name}`)
          ),
        })

        await doc.save()
        .then((doc) => {
          fs.writeFileSync(
            path.join(process.cwd(), `/Ressources_uploaded/Temporary_docs/${file.name}`),
            doc.file
          )
        })

        fs.unlinkSync(
          path.join(process.cwd(), `/public/${logo.name}`)
        )

        fs.unlinkSync(
          path.join(process.cwd(), `/Ressources_uploaded/Temporary_docs/${file.name}`)
        )

        res.status(201).send({
          message: "La ressource à bien été modifiée !!!!!",
          type: "success"
        })

        break;

      case (fields.link === true && fields.newLogo === true):

        ressource.set({
          link: values.link,
          name: values.name,
          file_size: 0,
          logo: fs.readFileSync(
            path.join(process.cwd(), `/public/${values.logo[0].name}`)
          ),
          logo_name: values.logo[0].name,
          describ: values.describ,
          updatedDate: dateNow,
          type: values.type,
          visibility: values.visibility,
          macOSX: macOSX,
          linux: linux,
          windows: windows
        })
        
        await ressource.save()
        .then((image) => {
          fs.writeFileSync(
            path.join(process.cwd(), `/public/${values.logo[0].name}`),
            image.logo
          )
        })

        fs.unlinkSync(
          path.join(process.cwd(), `/public/${values.logo[0].name}`)
        )

        res.status(201).send({
          message: "La ressource à bien été modifiée !!!!!",
          type: "success"
        })

        break;

      case (fields.newLogo === true):

        ressource.set(values)
        await ressource.save()

        ressource_logo = await db.Images.findOne({where:{id: ressource.Logos[0].id}})
        ressource_logo.set({
          name: logo.name,
          logo: fs.readFileSync(
            path.join(process.cwd(), `/public/${logo.name}`)
          ),
          mime_type: logo.type
        })

        await ressource_logo.save()
        .then((image) => {
          fs.writeFileSync(
            path.join(process.cwd(), `/public/${logo.name}`),
            image.logo
          )
        })

        fs.unlinkSync(
          path.join(process.cwd(), `/public/${logo.name}`)
        )

        if(values.newApp === true){

          fs.unlinkSync(
            path.join(process.cwd(), `/Ressources_uploaded/Apps/${data.oldAppName}`)
          )

        }

        res.status(201).send({
          message: "La ressource à bien été modifiée !!!!!",
          type: "success"
        })

        break;

      case (fields.newFile === true):

        ressource.set(values)
        await ressource.save()

        doc = await db.Docs.findOne({where: {id: ressource.Ressources_doc.DocId}})

        doc.set({
          file: fs.readFileSync(
            path.join(process.cwd(), `/Ressources_uploaded/Temporary_docs/${file.name}`)
          ),
        })

        await doc.save()
        .then((doc) => {
          fs.writeFileSync(
            path.join(process.cwd(), `/Ressources_uploaded/Temporary_docs/${file.name}`),
            doc.file
          )
        })

        fs.unlinkSync(
          path.join(process.cwd(), `/Ressources_uploaded/Temporary_docs/${file.name}`)
        )

        res.status(201).send({
          message: "La ressource à bien été modifiée !!!!!",
          type: "success"
        })

        break;
  
      case (fields.link === true ):

        console.log('link === true')
        ressource.set({
          link: values.link,
          name: values.name,
          file_size: 0,
          describ: values.describ,
          updatedDate: dateNow,
          type: values.type,
          visibility: values.visibility,
          macOSX: macOSX,
          linux: linux,
          windows: windows
        })
        
        await ressource.save()
        
        res.status(201).send({
          message: "La ressource à bien été modifiée !!!!!",
          type: "success"
        })

        break;

        default:
          console.log('in default')
          ressource.set(values)
          
          await ressource.save()

          if(values.newApp === true){

            fs.unlinkSync(
              path.join(process.cwd(), `/Ressources_uploaded/Apps/${data.oldAppName}`)
            )

          }

          res.status(201).send({
            message: "La ressource à bien été modifiée !!!!!",
            type: "success"
          })
        break;
    }

  } catch (error) {
    console.log('error in update route =====> ', error)

    res.status(500).send({
        message: "Oups ! Je n'ai pas pu créer la ressource en BDD",
        desc: error.toString(),
        type: "error"
    })    
  }
})
module.exports = router