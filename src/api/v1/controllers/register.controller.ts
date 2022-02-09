import express from 'express'
import bcrypt from 'bcrypt'
import { pool } from "../../../config/db"
import { validationResult } from 'express-validator'
import { QueryResult } from "pg"
import { UserData } from "../../../models/user-data"

export const register = async (req: express.Request, res: express.Response) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    try {
        const {employer, email, password} = req.body

        if (employer && !(!!req.body.company_name && req.body.company_name.length >= 3)) {
            return res.status(406).json({error: 'Wrong company name'})
        }

        const userData: QueryResult<UserData> = await pool.query(
            'SELECT id FROM "user" WHERE email = $1',
            [email.toLowerCase()]
        )

        if (userData.rows.length !== 0) {
            return res.status(409).json({error: 'User with this email already exists'})
        }

        bcrypt.hash(password, 10, async (err: Error | undefined, hash: string) => {
            if (err) {
                return res.status(500).json({error: 'Server error'})
            }
            await pool.query(
                'INSERT INTO "user" (email, password, employer) VALUES ($1, $2, $3) RETURNING id',
                [email.toLowerCase(), hash, employer],
                async (err, result) => {
                    if (err) {
                        return res.status(500).json({error: 'Unable to create account 1'})
                    } else {
                        if (employer) {
                            await pool.query(
                                'INSERT INTO employer (company_name, user_id) VALUES ($1, $2)',
                                [req.body.company_name, result.rows[0].id],
                                (err: Error) => {
                                    if (err) {
                                        return res.status(500).json({error: 'Unable to create account 2'})
                                    } else {
                                        return res.status(200).json({status: 'Success'})
                                    }
                                }
                            )
                        } else {
                            return res.status(200).json({status: 'Success'})
                        }
                    }
                }
            )
        })
    } catch (err) {
        res.status(500).json({error: 'Server error'})
    }
}
