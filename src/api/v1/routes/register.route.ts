import bcrypt from 'bcrypt'
import express from 'express'
import {pool} from "../../../db"

const router = express.Router()

router.post('/v1/register', async (req: any, res: any) => {

    try {
        const {account_type, email, password} = req.body

        if (
            !((account_type === 'employee' || account_type === 'employer') &&
                email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/) &&
                password.length >= 5)
        ) {
            return res.status(400).json({error: 'Server error'})
        }

        const db_user = await pool.query('SELECT * FROM "user" WHERE email = $1', [email.toLowerCase()])

        if (db_user.rows.length !== 0) {
            return res.status(409).json({error: 'User with this email already exists'})
        }

        bcrypt.hash(password, 10, async (err: any, hash: any) => {
            if (err) {
                return res.status(err).json({error: 'Server error'})
            }
            await pool.query(
                'INSERT INTO "user" (email, password, employee, employer) VALUES ($1, $2, $3, $4)',
                [email.toLowerCase(), hash, account_type === 'employee', account_type === 'employer'],
                (err: any) => {
                    if (err) {
                        return res.status(500).json({error: 'Unable to create account'})
                    } else {
                        return res.status(200).json({status: 'Success'})
                    }
                }
            )
        })
    } catch (err: any) {
        res.status(500).json({error: err.message})
    }
})

export {router as register}
