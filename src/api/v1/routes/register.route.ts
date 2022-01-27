import express from 'express'
import bcrypt, {hash} from 'bcrypt'
import {pool} from "../../../db"
import {body, validationResult} from 'express-validator';

const router = express.Router()

router.post(
    '/v1/register',
    body('email').isEmail(),
    body('password').isLength({min: 5}),
    body('employer').isBoolean(),
    async (req: express.Request,
           res: express.Response) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({errors: errors.array()});

        try {
            const {employer, email, password} = req.body

            const db_user = await pool.query(
                'SELECT id FROM "user" WHERE email = $1',
                [email.toLowerCase()]
            )

            if (db_user.rows.length !== 0) {
                return res.status(409).json({error: 'User with this email already exists'})
            }

            bcrypt.hash(password, 10, async (err: Error | undefined, hash: string) => {
                if (err) {
                    return res.status(500).json({error: 'Server error'})
                }
                await pool.query(
                    'INSERT INTO "user" (email, password, employer) VALUES ($1, $2, $3)',
                    [email.toLowerCase(), hash, employer],
                    (err: any) => {
                        if (err) {
                            return res.status(500).json({error: 'Unable to create account'})
                        } else {
                            return res.status(200).json({status: 'Success'})
                        }
                    }
                )
            })
        } catch (err) {
            res.status(500).json({error: 'Server error'})
        }
    })

export {router as register}
