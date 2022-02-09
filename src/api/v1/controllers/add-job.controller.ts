import express from "express"
import { pool } from "../../../config/db"
import { QueryResult } from "pg"
// @ts-ignore
import { Job } from "../../../models/job"
// @ts-ignore
import { UserData } from "../../../models/user-data"

export const addJob = async (req: express.Request, res: express.Response) => {

    try {
        const {name, remote, salary, description, benefits, requirements, skills, experience}: Job = req.body

        const userData: QueryResult<UserData> = await pool.query( // TODO: optimize (get id from token payload)
            'SELECT id FROM "user" WHERE email = $1',
            // @ts-ignore
            [req.jwtPayload.email]
        )

        await pool.query(
            'INSERT INTO job (name, remote, salary, description, benefits, skills, employer_id, experience) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            [name, remote, salary, description, benefits, JSON.stringify(skills), userData.rows[0].id, experience]
        )
        res.status(200).json({status: 'ok'})
    } catch (err) {
        res.status(500).json({error: 'Server error'})
    }
}
