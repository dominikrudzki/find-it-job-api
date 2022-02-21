import { Request, Response } from "express"

export const validatePath = (req: Request, res: Response) => {
    res.status(404).send('This page could not be found')
}
