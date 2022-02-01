const express =  require('express');  
let db = require("../../db/models/index")
const router = express.Router();

/**
 * This route return all user data profile and the numbers of incomplete fields.
 */
router.post('/new', async (req, res) =>{

  const data = req.body.data

  const date = new Date()
  const time = new Date().toLocaleTimeString()
  const post_date = date.toJSON().slice(0, 10)
  const post_time = time

  const newFeedback = {
      title: data.title,
      text: data.feedback,
      rate: data.rate,
      post_date: post_date,
      post_time: post_time,
      RessourceId: data.id,
      UserId: data.userID
  }

  try {
    const feedback = await db.Feedback.build(newFeedback)
    await feedback.save()

    const feedbacksCount = await db.Feedback.count({where: {RessourceId: data.id}})
    const feedbackSum = await db.Feedback.sum('rate',{where: {RessourceId: data.id}})
    const feedbacks = await db.Feedback.findAll({order: [['post_date','DESC'],['post_time','DESC']]})

    const average = feedbackSum/feedbacksCount

    res.status(201).send({
      message: "Merci pour votre commentaire, votre avis nous sera trés utile !!!!!!!",
      type: "success",
      feedbacks: feedbacks,
      average: average,
      count: feedbacksCount
    })  
  } catch (error) {
    console.log('error =====> ', error)
    res.status(500).send({
      message: "Oups ! Je n'ai pas pu poster le commentaire",
      type: "error"
    })
  }

})


router.post('/delete', async (req, res) =>{

    try {
    const data = req.body.data
    await db.Feedback.destroy({where: {id: data.id}})

    const feedbacksCount = await db.Feedback.count({where: {RessourceId: data.RessourceID}})
    const feedbackSum = await db.Feedback.sum('rate',{where: {RessourceId: data.RessourceID}})
    const feedbacks = await db.Feedback.findAll({order: [['postedAt','DESC']]})

    const average = feedbackSum/feedbacksCount
    
    res.status(200).send({
      message: "Votre commentaire a bien été supprimmé !!!!!!!!",
      type: "success",
      feedbacks: feedbacks,
      average: average,
      count: feedbacksCount
      })
  } catch (error) {
    console.log('error in /delete  =====> ', error)
    res.status(500).send({
      message: "Oups ! je n'ai pas pu supprimer le commentaire !!!!! ",
      type: 'error'
    })
  }

})

router.post('/update', async (req, res) =>{

    try {
    const data = req.body.data
    const feedBack = await db.Feedback.findOne({where: {id: data.id}})
    const date = new Date()

    await feedBack.update({
      title: data.title,
      rate: data.rate,
      text: data.text,
      updatedAt: date.toLocaleString(),
      RessourceId: data.id,
      UserId: data.userID
    })

    await feedBack.save()

    const feedbacksCount = await db.Feedback.count({where: {RessourceId: data.id}})
    const feedbackSum = await db.Feedback.sum('rate',{where: {RessourceId: data.id}})
    const feedbacks = await db.Feedback.findAll({order: [['postedAt','DESC']]})

    const average = feedbackSum/feedbacksCount
    
    res.status(200).send({
      message: "Votre commentaire a bien été modifié !!!!!!!!",
      type: "success",
      feedbacks: feedbacks,
      average: average,
      count: feedbacksCount
      })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: "Oups ! je n'ai pas pu modifié le commentaire !!!!! ",
      type: 'error'
    })
  }

})


module.exports = router