import express from 'express'
import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt'
import { pool } from "../../../config/db"
import { jwtConfig } from "../../../config/jwt"
import { UserData } from "../../../models/user-data"
import { QueryResult } from "pg"

export const changePassword = async (req: express.Request, res: express.Response) => {

    try {
        const {password, newPassword} = req.body

        const userData: QueryResult<UserData> = await pool.query(
            'SELECT password FROM "user" WHERE email = $1',
            // @ts-ignore
            [req.jwtPayload.email.toLowerCase()]
        )

        bcrypt.compare(password, userData.rows[0].password, async (err: Error | undefined, result: boolean) => {
            if (err) {
                return res.status(500).json({error: 'Server error'})
            } else if (result) {
                bcrypt.hash(newPassword, 10, async (err: Error | undefined, hash: string) => {
                    if (err) {
                        return res.status(500).json({error: 'Server error'})
                    }

                    await pool.query(
                        'UPDATE "user" SET password = $1 WHERE email = $2',
                        // @ts-ignore
                        [hash, req.jwtPayload.email]
                    )

                    res.status(200).json({message: 'Password changed'})
                })
            } else {
                return res.status(404).json({message: 'Invalid password'})
            }
        })
    } catch (err) {
        res.status(403).json({message: 'Unauthorized'})
    }
}
