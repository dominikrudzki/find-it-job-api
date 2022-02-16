import express from 'express'
import { pool } from "../../../config/db"
import { validationResult } from "express-validator"

export const getJobs = async (req: express.Request, res: express.Response) => {

    try {
        const {remote, experience, salary, skills} = req.body
        const values = [parseInt(req.params.offset)]
        let whereCondition = 'j.id >= 0'

        if (remote !== undefined) {
            values.push(remote)
            whereCondition += ` AND j.remote = $${values.length}`
        }
        if (experience !== undefined) {
            values.push(experience)
            whereCondition += ` AND LOWER(j.experience) = $${values.length}`
        }
        if (salary !== undefined) {
            values.push(salary)
            whereCondition += ` AND (j.salary ->> 'max')::DECIMAL > $${values.length}`
        }
        if (skills !== undefined) {
            values.push(skills)
            whereCondition += ` AND to_json(array(select LOWER(jsonb_array_elements(skills) ->> 'name')))::jsonb ?| $${values.length}`
        }

        const jobData = await pool.query(
            `SELECT j.id, j.name, e.company_image image, e.company_name company, j.remote, j.salary, j.experience, j.skills 
            FROM job j 
            INNER JOIN employer e ON j.employer_id = e.id
            WHERE ${whereCondition}
            ORDER BY j.id DESC OFFSET $1 LIMIT 5`,
            values
        )
        res.json(jobData.rows)
    } catch (err) {
        res.status(500).json({error: 'Server error'})
    }
}
