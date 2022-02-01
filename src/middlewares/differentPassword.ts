import express from 'express'

export const differentPassword = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const {password, newPassword} = req.body

    if (password !== newPassword) {
        next()
    } else {
        return res.status(406).json({error: 'Password cannot be the same'})
    }

}
