const express =  require('express');  
let db = require("../../db/models/index")
const fs = require('fs')
const path = require('path')
const router = express.Router();

/**
 * This route return all user data profile and the numbers of incomplete fields.
 */
router.post('/get', async (req, res) =>{

  if(req.body.type === "Doc"){
    try {
      const doc = await db.Docs.findOne({where: {id: req.body.id}})
        
      await fs.writeFileSync( path.join(process.cwd(), `/Ressources_uploaded/Temporary_docs/test.pdf`),doc.file)
      const file = fs.createReadStream(path.join(process.cwd(), `/Ressources_uploaded/Temporary_docs/test.pdf`))
      const stat = fs.statSync(path.join(process.cwd(), `/Ressources_uploaded/Temporary_docs/test.pdf`));

      res.setHeader('Content-Length', stat.size);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=quote.pdf');

      file.pipe(res);
    } catch (error) {
      console.log('err ===============> ', error)
    }  
  } else {
  
    try {
      const App = await db.Ressources.findOne({where: {id: req.body.id}})

      const file = fs.createReadStream(path.join(process.cwd(), `/Ressources_uploaded/Apps/${App.file_name}`))
      const stat = fs.statSync(path.join(process.cwd(), `/Ressources_uploaded/Apps/${App.file_name}`));

      res.setHeader('Content-Length', stat.size);
      res.setHeader('Content-Disposition', `attachment; filename=${App.file_name}`);

      console.log("start download : ", App.file_name)

      file.on('end', () => console.log('finish download : ', App.file_name))
      file.pipe(res);
    } catch (error) {
      console.log('err ===============> ', error)
      res.status(500).send({
        type: "error",
        Message: "Oups !!!! une erreur c'est produite durant le téléchargement !!!!!!"
      })
    }      
  
  }

 
})

module.exports = router