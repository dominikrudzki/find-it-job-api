import jwt from 'jsonwebtoken'
import {pool} from '../db'

export const auth = async (req: any, res: any, next: any) => {
    // const refreshToken = await pool.query('SELECT * FROM "user" WHERE email = $1', [/* user_token */])
    try {
        // jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!)
        next()
    } catch (err) {
        return res.status(403).json({error: 'Invalid token'})
    }
}
