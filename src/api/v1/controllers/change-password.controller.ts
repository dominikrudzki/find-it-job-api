import { Request, Response } from "express"
import bcrypt from 'bcrypt'
import { pool } from "../../../config/db"
import { UserData } from "../../../models/user-data"
import { QueryResult } from "pg"

export const changePassword = async (req: Request, res: Response) => {

    try {
        const {password, newPassword} = req.body

        const userData: QueryResult<UserData> = await pool.query(
            'SELECT password FROM "user" WHERE email = $1',
            [req.jwtPayload!.email]
        )

        bcrypt.compare(password, userData.rows[0].password, async (err: Error | undefined, result: boolean) => {
            if (err) {
                return res.status(500).json({message: 'Server error'})
            } else if (result) {
                bcrypt.hash(newPassword, 10, async (err: Error | undefined, hash: string) => {

                    if (err) return res.status(500).json({message: 'Server error'})

                    await pool.query(
                        'UPDATE "user" SET password = $1 WHERE email = $2',
                        [hash, req.jwtPayload!.email]
                    )

                    res.status(200).json({message: 'Password changed'})
                })
            } else {
                return res.status(404).json({message: 'Invalid password'})
            }
        })
    } catch (err) {
        res.status(403).json({message: 'Unauthorized'})
    }
}
