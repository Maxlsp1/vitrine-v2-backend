const multer = require('multer')
const path = require('path')
const storage = multer.diskStorage({

  destination: async (req, files, cb) => {
    cb(null, path.join(process.cwd(), "/public"))    
  },
  filename: (req, files, cb) => {
    cb(null, files.originalname)
  },
  fileFilter: (req, file, cb) =>{
      // Allowed ext
      const filetypes = /png|jpeg|jpg/;
      // Check ext
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      // Check mime
      const mimetype = filetypes.test(file.mimetype);

      if(mimetype && extname){
        return cb(null,true);
      } else {
        cb('Error: seul les images sont autorisées !');
      }
    }
})

const uploadImages = multer({storage: storage})
module.exports = uploadImages