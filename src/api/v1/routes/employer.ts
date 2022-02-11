import express from 'express'
import { changeCompanyImage } from "../controllers/change-company-image.controller"
import { isEmployer } from "../../../middlewares/is-employer"
import { authenticateToken } from "../../../middlewares/authenticate-token"
import { getEmployerJobs } from '../controllers/get-employer-job.controller'
import { getJobApplicationsController } from "../controllers/get-job-applications.controller"

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

router.get(
    '/get-job-applications/:jobId',
    authenticateToken,
    getJobApplicationsController
)

export default router
