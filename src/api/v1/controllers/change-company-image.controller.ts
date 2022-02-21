import { imageUpload } from "../../../middlewares/image-upload"
import { Request, Response } from "express"
import { pool } from "../../../config/db"
import { QueryResult } from "pg"
import fs from 'fs'

export const changeCompanyImage = (req: Request, res: Response) => {

    imageUpload(req, res, async (err) => {
        if (err) {
            return res.status(406).json({error: 'Invalid file type'})
        }

        try {
            const queryData: QueryResult<{ company_image: string }> = await pool.query(
                `UPDATE employer e
                SET company_image = $1
                FROM "user" u
                WHERE e.user_id = u.id AND u.email = $2
                RETURNING (
                    SELECT e2.company_image
                    FROM employer e2
                    WHERE e2.user_id = u.id
                )`,
                [req.file!.filename, req.jwtPayload!.email]
            )

            if (queryData.rows[0].company_image !== 'default.png') {
                try {
                    fs.unlinkSync('./src/public/resources/company_logos/' + queryData.rows[0].company_image)
                } catch (err) {
                    return res.status(500).json({message: 'Server error'})
                }
            }

            return res.status(200).json(req.file!.filename)
        } catch (err) {
            return res.status(500).json({message: 'Server error'})
        }
    })
}


