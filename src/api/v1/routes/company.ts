import express from 'express'
import { changeCompanyImage } from "../controllers/changeCompanyImage.controller"
import { isEmployer } from "../../../middlewares/isEmployer"
import { authenticateToken } from "../../../middlewares/authenticateToken"

const router = express.Router()

router.patch(
    '/change-company-image',
    authenticateToken,
    isEmployer,
    changeCompanyImage
)

// router.post(
//     '/change-company-image'
//      TODO: changeCompanyName
// )

export default router
