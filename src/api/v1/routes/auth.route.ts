import express from 'express';
const router = require('express').Router()

router.get('/', (req: express.Request,res: express.Response) => {
    res.send('Auth route')
})

module.exports = router