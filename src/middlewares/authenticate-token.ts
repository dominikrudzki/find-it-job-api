import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from "express"
import { jwtPayload } from "../models/jwt-payload"

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {

    if (!req.headers.authorization) return res.status(401).json({message: 'Unauthorized'})

    const bearer: string[] = req.headers.authorization.split(' ')

    try {
        req.jwtPayload = <jwtPayload>(<jwt.JwtPayload>jwt.verify(bearer[1], process.env.ACCESS_TOKEN_SECRET!))
        next()
    } catch (err) {
        return res.status(401).json({message: 'Unauthorized'})
    }
}
