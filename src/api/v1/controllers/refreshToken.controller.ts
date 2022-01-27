import express from "express"
import jwt from "jsonwebtoken"
import { pool } from "../../../config/db"

export const refreshToken = async (req: express.Request, res: express.Response) => {

    if (!req.headers.authorization) {
        return res.status(401).json({message: 'Token not found'})
    }

    const bearer: string[] = req.headers.authorization.split(' ')

    try {

        const refreshTokenPayload: any = jwt.decode(bearer[1], {complete: true})!.payload

        const userData = await pool.query(
            'SELECT password FROM "user" WHERE email = $1',
            [refreshTokenPayload.email.toLowerCase()]
        )

        jwt.verify(bearer[1], process.env.REFRESH_TOKEN_SECRET + userData.rows[0].password)

        const newAccessToken = jwt.sign(
            {email: refreshTokenPayload.email.toLowerCase()},
            process.env.ACCESS_TOKEN_SECRET + userData.rows[0].password,
            {expiresIn: '30m'}
        )

        return res.status(200).json({accessToken: newAccessToken})
    } catch (err) {
        console.log(err)
        return res.status(403).json({error: 'Unauthorized'}) // invalid token
    }
}