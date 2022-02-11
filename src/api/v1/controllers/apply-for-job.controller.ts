import express from "express"
import { pool } from "../../../config/db"

export const applyForJob = async (req: express.Request, res: express.Response) => {
    try {
        await pool.query(
            'INSERT INTO job_application (user_id , job_id) SELECT u.id, $1 FROM "user" u WHERE u.email = $2 AND NOT EXISTS (SELECT user_id, job_id FROM job_application WHERE job_id = $1 AND u.email = $2)',
            // @ts-ignore
            [parseInt(req.params.jobId), req.jwtPayload.email]
        )
        res.status(200).json({message: 'ok'})
    } catch (e) {
        res.status(500).json({message: 'Server error'})
    }
}
