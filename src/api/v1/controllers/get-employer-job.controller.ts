import express from "express"
import { pool } from "../../../config/db"

export const getEmployerJobs = async (req: express.Request, res: express.Response) => {
    try {
        const jobData = await pool.query(
            `SELECT j.id, j.name, COUNT(ja.id)::INTEGER applications FROM job j LEFT JOIN job_application ja ON j.id = ja.job_id JOIN employer e on e.id = j.employer_id JOIN "user" u on u.id = e.user_id WHERE u.email = $1 GROUP BY j.id`,
            // @ts-ignore
            [req.jwtPayload.email]
        )
        res.json(jobData.rows)
        res.status(200)
    } catch (err) {
        res.status(404).json({error: 'Server error'})
    }
}
