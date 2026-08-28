import express from 'express'
import cors from 'cors'
import generateRouter from './routes/generate.js'

const app = express()

const frontendUrl = process.env.FRONTEND_URL

function isAllowedOrigin(origin) {
  if (!origin) {
    return true
  }
  if (frontendUrl && origin === frontendUrl) {
    return true
  }
  try {
    const { hostname } = new URL(origin)
    return hostname === 'localhost' || hostname === '127.0.0.1'
  } catch {
    return false
  }
}

// Development allows the local frontend (and same-origin requests via the Vite
// proxy). Production only allows the configured FRONTEND_URL origin.
app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        return callback(null, true)
      }
      return callback(null, false)
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  })
)

app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Study Assistant API is running' })
})

app.use('/api', generateRouter)

export default app
