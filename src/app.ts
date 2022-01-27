import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'

import {getJob} from './api/v1/routes/get-job.route'
import {getJobs} from './api/v1/routes/get-jobs.route'
import {register} from './api/v1/routes/register.route'
import {login} from './api/v1/routes/login.route'
import {refreshToken} from './api/v1/routes/refresh-token.route'

const app = express()
app.use(cors())
app.use(express.json())
dotenv.config()

app.use('/api', getJob)
app.use('/api', getJobs)
app.use('/api', register)
app.use('/api', login)
app.use('/api', refreshToken)

app.listen(process.env.PORT, () => {
    console.log(`App listening on port ${process.env.PORT}`)
})
