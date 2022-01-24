import express from "express";

const pool = require("../../../db");
const bcrypt = require('bcrypt')
const router = require('express').Router()

router.post('/v1/login', async (req: express.Request, res: express.Response) => {
    const {email, password} = req.body

    try {
        // TODO: email and password validation
        
        const db_user = await pool.query('SELECT * FROM "user" WHERE email = $1', [email])

        if (db_user.rows.length === 0) {
            return res.status(404).json({error: 'User does not exist (or password is invalid)'})
        }

        if (password.length >= 5) {
            bcrypt.compare(password, db_user.rows[0].password, (err: any, result: any) => {
                console.log(err)
                if (err) {
                    return res.status(err).json({error: 'Server error'})
                } else if (result) {
                    return res.status(200).json({status: 'Success'})
                } else {
                    return res.status(404).json({error: 'User does not exist (or password is invalid)'})
                }
            })
        } else {
            return res.status(400).json({error: 'Password too short'}) // FIXME
        }
    } catch (err: any) {
        res.status(500).json({error: err.message})
    }
})

module.exports = router
