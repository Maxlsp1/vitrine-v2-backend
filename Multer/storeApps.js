const multer = require('multer')
const path = require('path')
const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "/Ressources_uploaded/Apps"))
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
  fileFilter: (req, file, cb) =>{
    // Allowed ext
    const filetypes = /exe|7z|dmg|gz|iso|jar|rar|tar|zip/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
      return cb(null,true);
    } else {
      cb('Error: seul les applications sont autorisées !');
    }
  }
})

const uploadApps = multer({storage: storage})
module.exports = uploadApps