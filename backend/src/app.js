import express from 'express'
import cors from 'cors'
import generateRouter from './routes/generate.js'
import streamRouter from './routes/stream.js'
import refineRouter from './routes/refine.js'

const app = express()

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://frontend-drab-eta-62.vercel.app',
]

function isAllowedOrigin(origin) {
  if (!origin) {
    return true
  }
  return allowedOrigins.includes(origin)
}

const corsOptions = {
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      return callback(null, true)
    }
    return callback(null, false)
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}

app.use(cors(corsOptions))

app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Study Assistant API is running' })
})

app.use('/api', generateRouter)
app.use('/api', streamRouter)
app.use('/api', refineRouter)

export default app
