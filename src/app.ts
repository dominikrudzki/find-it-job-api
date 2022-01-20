require('dotenv').config({path: __dirname + '/config/.env'})
import express from 'express'

const app = express()
app.use(express.json())

const authRoute = require('./api/v1/routes/auth.route')
app.use('/api/v1', authRoute)
const registerRoute = require('./api/v1/routes/register.route')
app.use('/api', registerRoute)

app.listen(process.env.PORT, () => {
    console.log(`App listening on port ${process.env.PORT}`)
})
