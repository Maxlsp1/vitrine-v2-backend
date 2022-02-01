const express =  require('express');  
const securePass = require('../../util/securePass')
const si = require('systeminformation');
let db = require("../../db/models/index")
const router = express.Router();

router.post('/update_ad_settings', async (req, res) =>{

  try {
  console.log('update settings')
    
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: "Oups ! je n'ai pas pu modifié le commentaire !!!!! ",
      type: 'error'
    })
  }

})

router.post('/get_settings', async (req, res) =>{

  try {
    const diskData = await si.fsSize()

    const settings = await db.appSettings.findAll()
    const tasks_settings = await db.Cron_tasks_Settings.findAll()

    const adSettings = await db.AdSettings.findAll()

    adSettings[0].Ldap_pass = securePass.decrypted(adSettings[0].Ldap_pass, adSettings[0].Token)
    adSettings[0].Ldap_username = securePass.decrypted(adSettings[0].Ldap_username, adSettings[0].Token)

    const backgroundBuff = settings[0].defaultBackground.toString('base64')
    settings[0].dataValues.defaultBackground = "data:"+settings[0].default_background_mimeType+";base64,"+backgroundBuff

    const logoBuff = settings[0].defaultLogo.toString('base64')
    settings[0].dataValues.defaultLogo = "data:"+settings[0].default_logo_mimeType+";base64,"+logoBuff

    const available = (((diskData[0].available /1024)/1024)/1024).toFixed(3)
    const size = parseFloat((((diskData[0].size /1024)/1024)/1024).toFixed(3))
    const used = parseFloat((((diskData[0].used /1024)/1024)/1024).toFixed(3))
    const maxAllowedLimit = parseFloat(((size*80)/100).toFixed(3))
    const disk_used_with_limit = parseFloat((settings[0].dbStorageLimit+settings[0].storageLimitServer).toFixed(3))
    const limitPercent = parseFloat(((disk_used_with_limit*100)/maxAllowedLimit).toFixed(3))     

    const disk =  {
      available: parseFloat(available),
      size: size,
      used: used,
      use: diskData[0].use
    }
    settings[0].dataValues.maxAllowedLimit = maxAllowedLimit
    settings[0].dataValues.disk_used_with_limit = disk_used_with_limit
    settings[0].dataValues.limitPercent = limitPercent
    settings[0].dataValues.DiskData = disk
    res.status(200).send({
      appSettings: settings[0],
      tasksSettings: tasks_settings,
      adSettings: adSettings[0]
    })
    
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: "Oups ! je n'ai pas pu récupérer les paramètres de l'application !!!!!",
      type: 'error'
    })
  }

})

router.post('/update_app_settings', async (req, res) =>{

  try {
  console.log('update settings')
    
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message: "Oups ! je n'ai pas pu modifié le commentaire !!!!! ",
      type: 'error'
    })
  }

})



module.exports = router