import { Request, Response } from "express"
import { pool } from "../../../config/db"

export const deleteJob = async (req: Request, res: Response) => {
    try {
        await pool.query(
          `DELETE FROM job j 
            USING employer e, "user" u 
            WHERE j.id = $1 
            AND j.employer_id = e.user_id
            AND e.user_id = u.id 
            AND u.email = $2`,
          [req.body.jobId, req.jwtPayload!.email]
        )

        res.status(200).json({message: 'ok'})
    } catch (err) {
        res.status(500).json({message: 'error'})
    }
}
