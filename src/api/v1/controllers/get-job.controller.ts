import { Request, Response } from "express"
import { pool } from "../../../config/db"

export const getJob = async (req: Request, res: Response) => {
  try {
    const jobId = req.params.jobId
    const jobData = await pool.query(
      `SELECT j.id, j.name, e.company_image image, e.company_name company, j.remote, j.salary, j.description, j.benefits, j.experience, j.skills 
            FROM job j 
            JOIN employer e ON j.employer_id = e.user_id
            WHERE j.id = $1`,
      [jobId]
    )

    res.json(jobData.rows[0])
  } catch (err) {
    res.status(500).json({message: 'Server error'})
  }
}
