import dotenv from 'dotenv'
import express from 'express'
import bcrypt from 'bcrypt'
import {pool} from "../../../db"
import {body, validationResult} from 'express-validator';
import jwt from 'jsonwebtoken'
import {authenticateToken} from "../../../middlewares/authenticateToken";

const router = express.Router()
dotenv.config()

router.post(
    '/v1/login',
    body('email').isEmail(),
    body('password').isLength({min: 5}),
    async (req: express.Request,
           res: express.Response) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({errors: errors.array()});

        try {
            const {email, password} = req.body

            const db_user = await pool.query('SELECT * FROM "user" WHERE email = $1', [email.toLowerCase()])

            if (db_user.rows.length === 0) return res.status(404).json({error: 'User does not exist'})

            bcrypt.compare(password, db_user.rows[0].password, async (err: any, result: any) => {
                if (err) {
                    return res.status(err).json({error: 'Server error'})
                } else if (result) {
                    // LOGIN SUCCESS
                    const accessToken = jwt.sign(
                        {email, employer: db_user.rows[0].employer},
                        process.env.ACCESS_TOKEN_SECRET!,
                        {expiresIn: '30m'}
                    )

                    const refreshToken = jwt.sign(
                        {},
                        process.env.REFRESH_TOKEN_SECRET!,
                        {expiresIn: '90d'}
                    )

                    await pool.query(
                        'UPDATE "user" SET refresh_token = $1 WHERE "user".id = $2',
                        [refreshToken, db_user.rows[0].id]
                    )

                    return res.status(200).json({accessToken, refreshToken})
                } else {
                    return res.status(404).json({error: 'Invalid password'})
                }
            })
        } catch (err: any) {
            console.log('erro')
            res.status(500).json({error: err.message})
        }
    })

router.post(
    '/v1/login-test',
    authenticateToken,
    async (req: express.Request, res: express.Response) => {
        res.status(200).json({status: 'You are logged in'})
    })

export {router as login}
