import express from "express";

const pool = require("../../../db");
const bcrypt = require('bcrypt')
const router = require('express').Router()

router.post('/v1/register', async (req: express.Request, res: express.Response) => {
    const {account_type, email, password} = req.body

    try {
        if (account_type === 'employee' || account_type === 'employer') {

            if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
                return res.status(400).json({error: 'Wrong email address type'})
            }

            const db_user = await pool.query('SELECT * FROM "user" WHERE email = $1', [email])

            if (db_user.rows.length !== 0) {
                return res.status(409).json({error: 'User with this email already exists'})
            }

            if (password.length >= 5) {
                bcrypt.hash(password, 10, async (err: number, hash: string) => {
                    if (err) {
                        return res.status(err).json({error: 'Server error'})
                    }
                    await pool.query(
                        'INSERT INTO "user" (email, password, employee, employer) VALUES ($1, $2, $3, $4)',
                        [email, hash, account_type === 'employee', account_type === 'employer'],
                        (err: any) => {
                            if (err) {
                                return res.status(500).json({error: 'Unable to create account'})
                            } else {
                                return res.status(200).json({status: 'Success'})
                            }
                        }
                    )
                })
            } else {
                return res.status(400).json({error: 'Password too short'})
            }
        } else {
            return res.status(500).json({error: 'Unknown account type'})
        }
    } catch (err: any) {
        res.status(500).json({error: err.message})
    }
})

module.exports = router
