require('dotenv').config({path: __dirname + '/config/.env'})
import express from 'express'
const app = express()
app.use(express.json())

// Middlewares
const authRoute = require('./api/v1/routes/auth')
app.use('/api/v1', authRoute)

app.listen(process.env.PORT,()=> {
    console.log(`App listening on port ${process.env.PORT}`)
})