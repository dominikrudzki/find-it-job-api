import { getJobs } from "../controllers/get-jobs.controller"
import { getJob } from "../controllers/get-job.controller"

const router = require('express').Router()

router.get(
    '/get-jobs',
    getJobs
)

router.get(
    '/get-job/:jobId',
    getJob
)

export default router
