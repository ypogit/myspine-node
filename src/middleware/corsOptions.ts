import { CorsOptions } from 'cors'
import 'dotenv/config'

type OriginCallback = (err: Error | null, origin?: boolean) => void

const port = process.env.PORT

const allowedOrigins: Array<string> = [
  `https://localhost:${port}`,
  `https://localhost:3000`
  // TODO: additional production origin
]

export const corsOptions: CorsOptions = {
  origin: (origin, callback: OriginCallback) => {
    // origin: HTTP request header value
    try {
      const isAllowed = allowedOrigins.includes(origin || '')
      callback(null, isAllowed)
    } catch (err) {
      console.error(err)
      callback(new Error('An error occurred during origin validation'))
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200,
}