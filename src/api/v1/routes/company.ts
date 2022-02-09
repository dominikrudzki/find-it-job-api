import express from 'express'
import { changeCompanyImage } from "../controllers/changeCompanyImage.controller"
import { isEmployer } from "../../../middlewares/isEmployer"
import { authenticateToken } from "../../../middlewares/authenticateToken"
import { getEmployerJobs } from '../controllers/get-employer-job.controller'

const router = express.Router()

router.patch(
    '/change-company-image',
    authenticateToken,
    isEmployer,
    changeCompanyImage
)

router.get(
    '/get-company-jobs',
    authenticateToken,
    getEmployerJobs
)

export default router
