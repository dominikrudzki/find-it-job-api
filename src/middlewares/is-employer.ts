import express from 'express'
import jwt from "jsonwebtoken"

export const isEmployer = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const bearer: string[] = req.headers.authorization!.split(' ')
    const accessTokenPayload: any = jwt.decode(bearer[1], {complete: true})!.payload

    if (accessTokenPayload.employer) {
        next()
    } else {
        res.status(401).json({error: 'Unauthorized'})
    }
}
