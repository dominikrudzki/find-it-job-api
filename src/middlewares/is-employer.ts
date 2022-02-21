import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

export const isEmployer = (req: Request, res: Response, next: NextFunction) => {
    const bearer: string[] = req.headers.authorization!.split(' ')
    const accessTokenPayload: any = jwt.decode(bearer[1], {complete: true})!.payload

    if (accessTokenPayload.employer) {
        next()
    } else {
        res.status(401).json({error: 'Unauthorized'})
    }
}
