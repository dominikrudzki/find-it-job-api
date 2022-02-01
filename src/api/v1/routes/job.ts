import express from 'express'
import { getJobs } from "../controllers/getJobs.controller"
import { getJob } from "../controllers/getJob.controller"
import { authenticateToken } from "../../../middlewares/authenticateToken"
import { isEmployer } from "../../../middlewares/isEmployer"
import { addJob } from "../controllers/addJob.controller"

const router = express.Router()

router.get(
    '/get-jobs',
    getJobs
)

router.get(
    '/get-job/:jobId',
    getJob
)

router.put(
    '/add-job',
    authenticateToken,
    isEmployer,
    addJob
)

export default router
