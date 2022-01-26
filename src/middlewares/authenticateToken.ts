import jwt from 'jsonwebtoken'

export const authenticateToken = async (req: any, res: any, next: any) => {

    if (!req.headers.authorization) return res.status(401).json({message: 'JWT Token not found'})

    const bearer = req.headers.authorization.split(' ')

    try {
        jwt.verify(bearer[1], process.env.ACCESS_TOKEN_SECRET!)
        next()
    } catch (err) {
        return res.status(403).json({error: 'Invalid token'})
    }
}
