import express from "express"
import { pool } from "../../../config/db"

export const getJobApplicationsController = async (req: express.Request, res: express.Response) => {
    try {
        const jobData = await pool.query(
            `SELECT u.email FROM job_application ja JOIN "user" u on u.id = ja.user_id JOIN job j on j.id = ja.job_id JOIN employer e on e.id = j.employer_id WHERE j.id = $1 AND j.employer_id = (SELECT e.id FROM employer e JOIN "user" u2 on e.user_id = u2.id WHERE u2.email = $2)`,
            // @ts-ignore
            [parseInt(req.params.jobId), req.jwtPayload.email]
        )

        res.status(200).json(jobData.rows)
    } catch (err) {
        res.status(500).json({message: 'Server error'})
    }
}
