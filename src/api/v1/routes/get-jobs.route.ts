import express from "express";

const pool = require("../../../db");
const router = require('express').Router()

router.get('/v1/get-jobs', async (req: express.Request, res: express.Response) => {
    try {
        const jobData = await pool.query(`SELECT j.id, j.name, e.company_image image, e.company_name company, j.remote, j.salary, j.experience, j.skills FROM job j INNER JOIN employer e ON j.employer_id = e.id`)
        res.json(jobData.rows)
    } catch (err: any) {
        res.status(404).json({error: err.message})
    }
})

module.exports = router
