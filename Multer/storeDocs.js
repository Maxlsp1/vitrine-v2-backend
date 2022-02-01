const multer = require('multer')
const path = require('path')
const storage = multer.diskStorage({

  destination: async (req, file, cb) => {
    cb(null, path.join(process.cwd(), "/Ressources_uploaded/Temporary_docs"))
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
  fileFilter: (req, file, cb) =>{
      // Allowed ext
      const filetypes = /pdf/;
      // Check ext
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      // Check mime
      const mimetype = filetypes.test(file.mimetype);

      if(mimetype && extname){
        return cb(null,true);
      } else {
        cb('Error: seul les PDF sont autorisées !');
      }
    }
})

const uploadDocs = multer({storage: storage})
module.exports = uploadDocs