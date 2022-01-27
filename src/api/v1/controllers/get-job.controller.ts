import express from 'express'
import { pool } from "../../../config/db"

export const getJob = async (req: express.Request, res: express.Response) => {
    try {
        const jobId = req.params.jobId
        const jobData = await pool.query(`SELECT j.id, j.name, e.company_image image, e.company_name company, j.remote, j.salary, j.description, j.benefits, j.requirements, j.experience, j.skills FROM job j INNER JOIN employer e ON j.employer_id = e.id WHERE j.id = ${jobId};`)
        res.json(jobData.rows[0])
    } catch (err: any) {
        res.status(500).json({error: err.message})
    }
}
