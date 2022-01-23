require('dotenv').config({path: __dirname + '/config/.env'})
import express from 'express'

const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

const authRoute = require('./api/v1/routes/auth.route')
app.use('/api', authRoute)
const getJob = require('./api/v1/routes/get-job.route')
app.use('/api', getJob)
const getJobs = require('./api/v1/routes/get-jobs.route')
app.use('/api', getJobs)


app.listen(process.env.PORT, () => {
    console.log(`App listening on port ${process.env.PORT}`)
})
