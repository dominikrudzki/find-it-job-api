import { Request, Response } from "express"
import jwt from "jsonwebtoken"
import { pool } from "../../../config/db"
import { QueryResult } from "pg"
import { UserData } from "../../../models/user-data"
import { jwtConfig } from "../../../config/jwt"
import { jwtPayload } from "../../../models/jwt-payload"

export const refreshToken = async (req: Request, res: Response) => {

    if (!req.headers.authorization) return res.status(401).end()

    const bearer: string[] = req.headers.authorization.split(' ')

    try {
        const refreshTokenPayload: jwtPayload = <jwtPayload>jwt.decode(bearer[1], {complete: true})!.payload

        const userData: QueryResult<UserData> = await pool.query(
            `SELECT * 
            FROM "user" 
            LEFT JOIN employer e ON "user".id = e.user_id 
            WHERE email = $1`,
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
    } catch {
        return res.status(401).end()
    }
}
