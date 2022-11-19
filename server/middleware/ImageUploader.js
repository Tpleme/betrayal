const multer = require('multer')
const path = require('path')

const imageFilter = (req, file, next) => {
    if (file.mimetype.startsWith('image')) {
        next(null, true)
    } else {
        next('Please upload only images', false)
    }
}

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, next) => {
        if (file) {
            next(null, path.join(__dirname, "../resources/images/temp"))
        }
    },
    filename: (req, file, next) => {
        const lastIndex = file.originalname.lastIndexOf('.')
        const fileExt = `.${file.originalname.slice(lastIndex + 1)}`

        next(null, `${req.res.locals.image_id}_${file.fieldname}${fileExt}`)
    }
})

const UserImageUploader = multer({ storage: fileStorageEngine, fileFilter: imageFilter })
    .fields([{ name: 'picture', maxCount: 1 }]);

module.exports = {
    UserImageUploader
}