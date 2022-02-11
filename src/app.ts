import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import job from "./api/v1/routes/job"
import auth from "./api/v1/routes/auth"
import employer from "./api/v1/routes/employer"
import developer from "./api/v1/routes/developer"
import { validatePath } from "./middlewares/validate-path"

const app = express()

app.use(cors())
app.use(express.json())
dotenv.config({path: __dirname + '/config/.env'})

app.use('/api/v1', job)
app.use('/api/v1', auth)
app.use('/api/v1', employer)
app.use('/api/v1', developer)
app.use('/company_logos', express.static('src/public/resources/company_logos'), validatePath)

app.listen(process.env.PORT, () => {
    console.log(`App listening on port ${process.env.PORT}`)
})
