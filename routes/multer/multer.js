const multer=require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'routes/uploads')
    },
    filename: function (req, file, cb) {
      
      cb(null, Date.now() +` ${file.originalname}`)
    }
  })
  
const upload = multer({ storage: storage })
const cpUpload = upload.fields([{ name: 'CV', maxCount: 1 }, { name: 'certifications', maxCount: 8 }])

module.exports=cpUpload