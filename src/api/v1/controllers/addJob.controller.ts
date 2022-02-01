import express from "express"
import { pool } from "../../../config/db"
import jwt from "jsonwebtoken"
import { QueryResult } from "pg"
import { Job } from "../../../models/Job"
import { UserData } from "../../../models/UserData"

export const addJob = async (req: express.Request, res: express.Response) => {

    const bearer: string[] = req.headers.authorization!.split(' ')
    const accessTokenPayload: any = jwt.decode(bearer[1], {complete: true})!.payload

    try {
        const {name, remote, salary, description, benefits, requirements, skills, experience}: Job = req.body

        const userData: QueryResult<UserData> = await pool.query(
            'SELECT id FROM "user" WHERE email = $1',
            [accessTokenPayload.email.toLowerCase()]
        )

        await pool.query(
            'INSERT INTO job (name, remote, salary, description, benefits, requirements, skills, employer_id, experience) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
            [name, remote, salary, description, benefits, requirements, JSON.stringify(skills), userData.rows[0].id, experience]
        )
        res.status(200).json({status: 'ok'})
    } catch (err) {
        console.log(err)
        res.status(500).json({error: 'Server error'})
    }
}
