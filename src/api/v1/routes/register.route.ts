import express from "express";

const pool = require("../../../db");
const router = require('express').Router()

router.get('/v1/register', async (req: express.Request, res: express.Response) => {
    try {
        // const users = await pool.query('SELECT * FROM "user"')
        // res.json({users: users.rows})
    } catch (err: any) {
        res.status(500).json({error: err.message})
    }
})

module.exports = router
