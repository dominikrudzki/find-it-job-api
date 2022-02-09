import express from "express"
import jwt from "jsonwebtoken"
import { pool } from "../../../config/db"
import { QueryResult } from "pg"
import { UserData } from "../../../models/UserData"
import { jwtConfig } from "../../../config/jwt"

export const refreshToken = async (req: express.Request, res: express.Response) => {

    if (!req.headers.authorization) {
        return res.status(401).json({message: 'Token not found'})
    }

    const bearer: string[] = req.headers.authorization.split(' ')

    try {
        const refreshTokenPayload: any = jwt.decode(bearer[1], {complete: true})!.payload

        const userData: QueryResult<UserData | any> = await pool.query(
            'SELECT * FROM "user" INNER JOIN employer e on "user".id = e.user_id WHERE email = $1',
            [refreshTokenPayload.email.toLowerCase()]
        )

        jwt.verify(bearer[1], process.env.REFRESH_TOKEN_SECRET + userData.rows[0].password)

        const {employer, company_name, company_image} = userData.rows[0]

        const newAccessToken = jwt.sign(
            {
                email: refreshTokenPayload.email.toLowerCase(),
                employer: userData.rows[0].employer,
                companyName: employer ? company_name : undefined,
                companyImage: employer ? company_image : undefined
            },
            process.env.ACCESS_TOKEN_SECRET!,
            {expiresIn: jwtConfig.accessToken.expiresIn}
        )

        return res.status(200).json({accessToken: newAccessToken})
    } catch (err) {
        console.log(err)
        return res.status(403).json({error: 'Unauthorized'}) // invalid token
    }
}
