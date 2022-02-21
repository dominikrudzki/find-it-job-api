import { Request, Response } from "express"
import { pool } from "../../../config/db"

export const applyForJob = async (req: Request, res: Response) => {

    try {
        await pool.query(
            `INSERT INTO job_application (user_id , job_id) 
            SELECT u.id, $1 
            FROM "user" u 
            WHERE u.email = $2 
            AND NOT EXISTS (
                SELECT user_id, job_id 
                FROM job_application 
                WHERE user_id = u.id AND job_id = $1
            )`,
            [parseInt(req.params.jobId), req.jwtPayload!.email]
        )

        res.status(200).json({message: 'ok'})
    } catch (e) {
        res.status(500).json({message: 'Server error'})
    }
}
