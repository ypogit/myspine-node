import { CorsOptions } from 'cors'
import 'dotenv/config'

type OriginCallback = (err: Error | null, origin?: boolean) => void

const allowedOrigins: Array<string> = [
  `${process.env.CLIENT_URL}`
  // TODO: additional production origin
]

export const corsOptions: CorsOptions = {
  origin: (origin, callback: OriginCallback) => {
    // origin: HTTP request header value
    // try {
    //   const isAllowed = allowedOrigins.includes(origin || '')
    //   console.log(isAllowed)
    //   callback(null, isAllowed)
    // } catch (err) {
    //   console.error(err)
    //   callback(new Error('An error occurred during origin validation'))
    // }
    if (origin === process.env.CLIENT_URL || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200,
}