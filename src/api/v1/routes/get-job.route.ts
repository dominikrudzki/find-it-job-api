import express from "express";

const pool = require("../../../db");
const router = require('express').Router()

router.get('/v1/get-job/:jobId', async (req: express.Request, res: express.Response) => {
    try {
        const jobId = req.params.jobId;
        const jobData = await pool.query(`SELECT j.id, j.name, e.company_image image, e.company_name company, j.remote, j.salary, j.description, j.benefits, j.requirements, j.experience, j.skills FROM job j INNER JOIN employer e ON j.employer_id = e.id WHERE j.id = ${jobId};`)
        res.json(jobData.rows[0])
    } catch (err: any) {
        res.status(500).json({error: err.message})
    }
})

export {router as getJob}
