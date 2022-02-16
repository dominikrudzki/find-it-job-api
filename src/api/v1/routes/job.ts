import express from 'express'
import { getJobs } from "../controllers/get-jobs.controller"
import { getJob } from "../controllers/get-job.controller"
import { authenticateToken } from "../../../middlewares/authenticate-token"
import { isEmployer } from "../../../middlewares/is-employer"
import { addJob } from "../controllers/add-job.controller"
import { deleteJob } from "../controllers/detete-job.controller"
import { body } from "express-validator"

const router = express.Router()

router.post(
    '/get-jobs/:offset',
    body('remote').isBoolean(),
    body('experience').isIn(['Junior', 'Mid', 'Senior']),
    body('salary').isNumeric(),
    body('skills').isArray(),
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

router.delete(
    '/delete-job',
    authenticateToken,
    isEmployer,
    deleteJob
)

export default router
