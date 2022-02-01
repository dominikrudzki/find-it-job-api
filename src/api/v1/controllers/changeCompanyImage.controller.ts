import { imageUpload } from "../../../middlewares/imageUpload"
import express from "express"
import { pool } from "../../../config/db"
import jwt from "jsonwebtoken"

export const changeCompanyImage = (req: express.Request, res: express.Response) => {

    const bearer: string[] = req.headers.authorization!.split(' ')
    const accessTokenPayload: any = jwt.decode(bearer[1], {complete: true})!.payload

    imageUpload(req, res, async (err) => {
        if (err) {
            return res.status(406).json({error: 'Invalid file type'})
        }
        await pool.query(
            'UPDATE employer e SET company_image = $1 FROM "user" u WHERE e.user_id = u.id AND u.email = $2',
            [req.file!.filename, accessTokenPayload.email],
            (err: Error) => {
                if (err) {
                    return res.status(500).json({error: 'Server error'})
                } else {
                    return res.status(200).json({status: 'ok'})
                }
            }
        )
    })
}


