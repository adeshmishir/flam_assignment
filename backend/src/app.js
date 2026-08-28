import express from 'express'
import cors from 'cors'
import generateRouter from './routes/generate.js'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Study Assistant API is running' })
})

app.use('/api', generateRouter)

export default app
