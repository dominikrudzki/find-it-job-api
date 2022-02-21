import { Request, Response } from "express"
import { pool } from "../../../config/db"
import { QueryResult } from "pg"
import { Job } from "../../../models/job"
import { UserData } from "../../../models/user-data"

export const addJob = async (req: Request, res: Response) => {

    try {
        const {name, remote, salary, description, benefits, skills, experience}: Job = req.body

        const userData: QueryResult<UserData> = await pool.query(
            `SELECT id 
            FROM "user" 
            WHERE email = $1`,
            [req.jwtPayload!.email]
        )

        await pool.query(
            'INSERT INTO job (name, remote, salary, description, benefits, skills, employer_id, experience) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            [name, remote, salary, description, benefits, JSON.stringify(skills), userData.rows[0].id, experience]
        )

        res.status(200).json({message: 'ok'})
    } catch (err) {
        res.status(500).json({message: 'Server error'})
    }
}
