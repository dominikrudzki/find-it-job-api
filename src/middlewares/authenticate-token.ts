import jwt from 'jsonwebtoken'
import express from "express"

export const authenticateToken = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!req.headers.authorization) {
        return res.status(401).json({message: 'Unauthorized'}) // Token not found
    }

    const bearer: string[] = req.headers.authorization.split(' ')

    try {
        // @ts-expect-error
        req.jwtPayload = (<jwt.JwtPayload>jwt.verify(bearer[1], process.env.ACCESS_TOKEN_SECRET!))
        next()
    } catch (err) {
        return res.status(401).json({message: 'Unauthorized'})
    }
}
