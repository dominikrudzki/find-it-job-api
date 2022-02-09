import express from 'express'
import bcrypt from 'bcrypt'
import { pool } from "../../../config/db"
import { validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import { jwtConfig } from "../../../config/jwt"
import { QueryResult } from "pg"
import { UserData } from "../../../models/user-data"

export const login = async (req: express.Request, res: express.Response) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) return res.status(400).json({errors: errors.array()})

    try {
        const {email, password} = req.body

        const userData: QueryResult<UserData | any> = await pool.query(
            'SELECT * FROM "user" INNER JOIN employer e on "user".id = e.user_id WHERE email = $1',
            [email.toLowerCase()]
        )

        if (userData.rows.length === 0) {
            return res.status(404).json({error: 'User does not exist'})
        }

        bcrypt.compare(password, userData.rows[0].password, async (err: Error | undefined, result: boolean) => {
            if (err) {
                return res.status(500).json({error: 'Server error'})
            } else if (result) {

                const {employer, company_name, company_image} = userData.rows[0]

                const accessToken = jwt.sign(
                    {
                        email: email.toLowerCase(),
                        employer,
                        companyName: employer ? company_name : undefined,
                        companyImage: employer ? company_image : undefined
                    },
                    process.env.ACCESS_TOKEN_SECRET!,
                    {expiresIn: jwtConfig.accessToken.expiresIn}
                )

                const refreshToken = jwt.sign(
                    {email: email.toLowerCase()}, // FIXME add rest data
                    process.env.REFRESH_TOKEN_SECRET + userData.rows[0].password,
                    {expiresIn: jwtConfig.refreshToken.expiresIn}
                )
                return res.status(200).json({accessToken, refreshToken})
            } else {
                return res.status(404).send('Invalid password')
            }
        })
    } catch (err) {
        res.status(500).json({error: 'Server error'})
    }
}

export const loginTest = (req: express.Request, res: express.Response) => {
    res.status(200).json({status: 'You are logged in'})
}
