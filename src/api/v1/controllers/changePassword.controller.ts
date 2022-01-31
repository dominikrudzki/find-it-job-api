import express from 'express'
import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt'
import { pool } from "../../../config/db"

export const changePassword = async (req: express.Request, res: express.Response) => {

    const bearer: string[] = req.headers.authorization!.split(' ')
    const accessTokenPayload: any = jwt.decode(bearer[1], {complete: true})!.payload

    try {
        const {password, newPassword} = req.body

        const userData = await pool.query(
            'SELECT password FROM "user" WHERE email = $1',
            [accessTokenPayload.email.toLowerCase()]
        )

        bcrypt.compare(password, userData.rows[0].password, async (err: Error | undefined, result: boolean) => {
            if (err) {
                return res.status(500).json({error: 'Server error'})
            } else if (result) {
                // success password verification
                bcrypt.hash(newPassword, 10, async (err: Error | undefined, hash: string) => {
                    if (err) {
                        return res.status(500).json({error: 'Server error'})
                    }

                    await pool.query(
                        'UPDATE "user" SET password = $1 WHERE email = $2',
                        [hash, accessTokenPayload.email]
                    )

                    const accessToken = jwt.sign(
                        {email: accessTokenPayload.email, employer: accessTokenPayload.employer},
                        process.env.ACCESS_TOKEN_SECRET + hash,
                        {expiresIn: '30m'}
                    )

                    const refreshToken = jwt.sign(
                        {email: accessTokenPayload.email},
                        process.env.REFRESH_TOKEN_SECRET + hash,
                        {expiresIn: '200d'}
                    )

                    res.status(200).json({accessToken, refreshToken})
                })

            } else {
                return res.status(404).json({error: 'Invalid password'})
            }
        })
    } catch (err) {
        res.status(403).json({error: 'Unauthorized'})
    }
}
