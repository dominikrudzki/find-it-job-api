import { Request, Response } from "express"
import { pool } from "../../../config/db"

export const getEmployerJobs = async (req: Request, res: Response) => {
    try {
        const jobData = await pool.query(
          `SELECT j.id, j.name, COUNT(ja.id)::INTEGER applications 
            FROM job j 
            LEFT JOIN job_application ja ON j.id = ja.job_id 
            JOIN employer e on e.user_id = j.employer_id 
            JOIN "user" u on u.id = e.user_id 
            WHERE u.email = $1 
            GROUP BY j.id`,
          [req.jwtPayload!.email]
        )

        res.status(200).json(jobData.rows)
    } catch (err) {
        res.status(500).json({message: 'Server error'})
    }
}
