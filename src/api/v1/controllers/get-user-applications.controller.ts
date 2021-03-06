import { Request, Response } from "express"
import { pool } from "../../../config/db"

export const getUserApplications = async (req: Request, res: Response) => {
    try {
        const applicationsData = await pool.query(
            `SELECT j.id, j.name 
            FROM job j 
            JOIN job_application ja ON j.id = ja.job_id 
            JOIN "user" u ON u.id = ja.user_id 
            WHERE u.email = $1`,
            [req.jwtPayload!.email]
        )

        res.status(200).json(applicationsData.rows)
    } catch (e) {
        res.status(500).json({message: 'Server error'})
    }
}
