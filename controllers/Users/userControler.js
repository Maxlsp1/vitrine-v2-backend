const express =  require('express');  
let db = require("../../db/models/index")
const router = express.Router();

/**
 * This route return all user data profile and the numbers of incomplete fields.
 */

router.post('/getUser', (req, response)=> {
  db.User.findOne({
    where:{id: req.body.id},
    include: db.Services,
  })
  .then((res) =>{

    response.status(200).send({
      id: res.dataValues.id,
      name: res.dataValues.name,
      mail: res.dataValues.mail,
    })
  }).catch((err) =>{
      console.log("err => ",err)  
     
      response.status(500).send({
        message: {

          message: "erreur impossible de récupérer le profil utilisateur contactez votre administrateur réseau",
          type: "error" 
        }
      })
    })
})

/**
 * When the user has used the application at least once, the 
 * 'firstUse' variable is set to false.
 * This is related to the presentation of Manon.
 */

router.post('/updateFirstUse',async (req, res) =>{
  var user = await db.User.findOne({where:{id: req.body.id}})
  
  if(user){
      console.log('user => ', user)
      user.firstUse = false
      await user.save()
  } 
  res.status(200).send({
          message: {

            message: "votre profil à bien été modifié",
            type: "success"
          }
      })
})

/**
 * Update User data profile in db.
 */

router.post('/updateUser',async (req, response) =>{

  const data = req.body.data
  try {

    let user = await db.User.findOne({
      where:{id: data.id}
    })
    if(user){ 
      user.theme = data.userUpdate.theme
      user.name = data.userUpdate.name
      user.mail = data.userUpdate.mail
      user.avatarColor = data.userUpdate.avatarColor
      user.id = data.id
      
      await user.save({fields: data.fields})

      const userSaved =  await db.User.findOne({
        where:{id: data.id},
        include: db.Services
      }) 

      response.status(200).send({
        user: {
          data: userSaved,
        },
          message: {

            message: "votre profil à bien été modifié !",
            type: "success"
          }
      })
    }
    
  } catch (error) {

    console.log("err in user update  ======> ",error)  
      response.status(500).send({
        message: {

          message: "Oups ! je n'ai pas pu sauvegarder vos préferences",
          type: "error" 
        }
      })
  }
})

module.exports = router