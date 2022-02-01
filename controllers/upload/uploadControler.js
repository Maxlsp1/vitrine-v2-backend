const express =  require('express');  
const multer = require('multer')
const uploadImages = require('../../Multer/storeImages');
const uploadApps = require('../../Multer/storeApps')
const uploadDocs = require('../../Multer/storeDocs');
const db = require('../../db/models/index')
const { suid } = require('rand-token');
const fs = require('fs');
const path = require('path');
const router = express.Router();

/**
 * This route return all user data profile and the numbers of incomplete fields.
 */

router.post('/upload_Images',uploadImages.any(), async (req, res)=> {

   try {

      const ressource_uid = req.body.uid
      const background_name = req.body.background_name
      const logo_name = req.body.logo_name
      const Files = req.files

      const ressource = await db.Ressources.findOne({
        where:{key: ressource_uid}
      })

      await Promise.all(Files.map((image) =>{
        console.log("image : ", image.filename)
        let image_type = null
        if(image.filename === background_name){

          image_type = "background"

        } else if(image.filename === logo_name){
          image_type = "logo"
        }

        db.Images.create({
          name: image.filename,
          mime_type: image.mimetype,
          image: fs.readFileSync(
              path.join(process.cwd(), `/public/${image.filename}`)
            ),
          image_type: image_type,
          RessourceId: ressource.id
        })
        .then((image) => {
          fs.writeFileSync(
            path.join(process.cwd(), `/public/${image.filename}`),
            image.image
          );
        })
      }))
    
      res.status(200).send({status: "success"})
   } catch (error) {

      console.log(error)

      if (error instanceof multer.MulterError) {

        res.status(500).send({
          message: "Oups ! il semblerait qu'il y ait eu une erreur !!!!",
          desc: error.toString(),
          type: "error"
        })

      } else {

        res.status(500).send({
          message: "Oups ! je n'ai pas pu m'occuper de la sauvegarde de(s) (l')image(s) !!!!",
          desc: error.toString(),
          type: "error"
        })
      }
   }
})

router.post('/upload_file', uploadApps.any(), async(req, res) =>{

  const ressource_uid = req.body.uid
  const Files = req.files
  try {

    const ressource = await db.Ressources.findOne({
      where:{key: ressource_uid}
    })
    ressource.set({
      file_name: Files[0].filename,
      file_size: (Files[0].size/1024)/1024
    })
    await ressource.save()
    res.status(200).send({status: "success"})
  } catch (error) {

    console.log(error)

    if (error instanceof multer.MulterError) {

      res.status(500).send({
        message: "Oups ! il semblerait qu'il y ait eu une erreur !!!!",
        desc: error.toString(),
        type: "error"
      })
    } else {
      res.status(500).send({
        message: "Oups ! je n'ai pas pu m'occuper de la sauvegarde du fichier !!!!",
        desc: error.toString(),
        type: "error"
      })
    }
  }
})

router.post('/upload_docs', uploadDocs.any(),async (req, res) =>{

    try {
      const Files = req.files
      const association = req.body.association
      const ressource_uid = req.body.uid

      const ressource = await db.Ressources.findOne({
        where:{key: ressource_uid}
      })

      const Doc = await db.Docs.create({
          file: await fs.readFileSync(
            path.join(process.cwd(), `/Ressources_uploaded/Temporary_docs/${Files[0].filename}`)
          ),
          file_size: (Files[0].size/1024)/1024,
        })
        .then((file) => {
          fs.writeFileSync(
            path.join(process.cwd(), `/Ressources_uploaded/Temporary_docs/${Files[0].filename}`),
            file.file
          );
          return file
        })

      if(association === true){

        ressource.set({
          has_procedure: true
        })

        const date = new Date()
        const ressource_doc = await db.Ressources.create({

          key: suid(16),
          name: `${ressource.name}-procédure`,
          file_name: Files[0].filename,
          file_size: (Files[0].size/1024)/1024,
          is_essential: ressource.is_essential,
          describ: ressource.describ,
          createdDate: date.toLocaleString(),
          type: 'docs',
          visibility: ressource.visibility,
        })

        await Promise.all([
          db.Ressources_docs.create({RessourceId: ressource_doc.id, DocId: Doc.id}),
          db.Ressources_docs.create({RessourceId: ressource.id, DocId: Doc.id}),
          ressource.save()
        ])
      } else {

        ressource.set({
          file_name: Files[0].filename,
          file_size: (Files[0].size/1024)/1024
        })
        await Promise.all([

          db.Ressources_docs.create({RessourceId: ressource.id, DocId: Doc.id}),
          ressource.save()
        ])

      }

      fs.unlinkSync(
        path.join(process.cwd(), `/Ressources_uploaded/Temporary_docs/${Files[0].filename}`)
      )
      res.status(200).send({status: "success"})
    } catch (error) {
      console.log(error)

       if (error instanceof multer.MulterError) {

        console.log(err)
        res.status(500).send({
          message: "Oups ! il semblerait qu'il y ait eu une erreur !!!!",
          desc: error.toString(),
          type: "error"
        })

      } else {

        res.status(500).send({
          message: "Oups ! je n'ai pas pu m'occuper de la sauvegarde de la procédure !!!!",
          desc: error.toString(),
          type: "error"
        })
      }
    }
})

module.exports = router