import express from "express"
import { pool } from "../../../config/db"

export const deleteJob = async (req: express.Request, res: express.Response) => {
    try {
        await pool.query(
            'DELETE FROM job j USING employer e, "user" u WHERE j.id = $1 AND j.employer_id = e.id AND e.user_id = u.id AND u.email = $2',
            // @ts-ignore
            [req.body.jobId, req.jwtPayload.email]
        )

        res.status(200).json({status: 'ok'})
    } catch (err) {
        res.status(500).json({status: 'error'})
    }
}
