import express from 'express'

const router = express.Router()

router.get('/v1', (req: express.Request, res: express.Response) => {
    res.send('Auth route')
})

export {router as authRoute}
