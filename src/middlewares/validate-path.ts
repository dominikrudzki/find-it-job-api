import express from 'express'

export const validatePath = (req: express.Request, res: express.Response) => {
    res.status(404).send('This page could not be found')
}
