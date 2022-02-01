import express from 'express'
import { pool } from "../../../config/db"

export const getJobs = async (req: express.Request, res: express.Response) => {
    try {
        // TODO: order by date newest first and limit to e.g. 10
        const jobData = await pool.query(`SELECT j.id, j.name, e.company_image image, e.company_name company, j.remote, j.salary, j.experience, j.skills FROM job j INNER JOIN employer e ON j.employer_id = e.id`)
        res.json(jobData.rows)
    } catch (err) {
        res.status(404).json({error: 'Server error'})
    }
}
