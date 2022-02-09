import multer from "multer"
import { v4 as uuidv4 } from "uuid"

export const imageUpload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './src/public/resources/company_logos')
        },
        filename: (req, file, cb) => {
            const ext = file.mimetype.split('/')[1]
            cb(null, uuidv4() + '.' + ext)
        }
    }),
    limits: {
        fileSize: 4000000
    },
    fileFilter: async (req, file, cb) => {
        const ext = file.mimetype
        if (ext !== 'image/jpg' && ext !== 'image/png') {
            return cb(new Error())
        }
        cb(null, true)
    }
}).single('company_logo')
