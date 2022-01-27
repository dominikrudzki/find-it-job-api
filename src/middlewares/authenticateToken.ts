import jwt from 'jsonwebtoken'
import express from "express";
import {pool} from "../db"


export const authenticateToken = async (req: express.Request, res: express.Response, next: express.NextFunction) => {

    if (!req.headers.authorization) {
        return res.status(401).json({message: 'Unauthorized'}) // Token not found
    }

    const bearer: string[] = req.headers.authorization.split(' ')

    try {
        const accessTokenPayload: any = jwt.decode(bearer[1], {complete: true})!.payload

        const userData = await pool.query(
            'SELECT password FROM "user" WHERE email = $1',
            [accessTokenPayload.email.toLowerCase()]
        )

        jwt.verify(bearer[1], process.env.ACCESS_TOKEN_SECRET + userData.rows[0].password)

        next()
    } catch (err) {
        return res.status(401).json({error: 'Unauthorized'})
    }
}
