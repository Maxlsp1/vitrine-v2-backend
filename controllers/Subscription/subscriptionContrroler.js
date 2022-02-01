const express =  require('express');  
const fs = require('fs')
const path = require('path')
const webpush = require('web-push')
const router = express.Router();

/**
 * This route return all user data profile and the numbers of incomplete fields.
 */
router.post('/subscribe', async (req, res) =>{

  let url = ""
  if(process.env.NODE_ENV === "production"){
    url = "https://someUrl"
  } else {
    url = "http://localhost:8001"
  }

  try {
    const payload = JSON.stringify({
      title: req.body.title,
      text: req.body.text,
      image: `${url}/${req.body.image}`,
      tag: req.body.tag,
      url: req.body.url
    })

    await webpush.sendNotification(req.body.subscription, payload).catch(e => console.log(e.stack))
    res.status(200).json({'success': true})

  } catch (error) {
    console.log('error : ', error)
  }
})

module.exports = router