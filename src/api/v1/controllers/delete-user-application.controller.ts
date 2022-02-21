import { Request, Response } from "express"
import { pool } from "../../../config/db"

export const deleteUserApplication = async (req: Request, res: Response) => {
    try {
        await pool.query(
            `DELETE FROM job_application ja 
            USING job j, "user" u 
            WHERE j.id = $1 
            AND u.email = $2 
            AND ja.job_id = j.id 
            AND ja.user_id = u.id`,
            [parseInt(req.params.jobId), req.jwtPayload!.email]
        )

        res.status(200).json({message: 'ok'})
    } catch (e) {
        res.status(500).json({message: 'Server error'})
    }
}
