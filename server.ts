import express, { RequestHandler } from 'express'
import cors, { CorsOptions } from 'cors'
import fs from 'fs'
import https from 'https'

// import helmet from 'helmet'
// import Ajv from 'ajv'
// import rateLimit from 'express-limiter';
// import session from 'express-session';
// import SQLiteStore from 'better-sqlite3-session-store';

import "dotenv/config"

type StaticOrigin = boolean | string | RegExp | Array<boolean | string | RegExp>
type OriginCallback = (err: Error | null, origin?: boolean) => void

const app = express()
const port = process.env.PORT || 8443
const credentials = {
  key: fs.readFileSync(process.env.PRIVATE_KEY_PATH 
    || './certs/local-key.pem', 'utf8'),
  cert: fs.readFileSync(process.env.CERTIFICATE_PATH 
    || './certs/local-cert.pem', 'utf8')
}
const server = https.createServer(credentials, app)

const allowedOrigins: Array<string> = [
  'https://localhost:8443'
  // TODO: additional production origin
]

const corsOptions: CorsOptions = {
  origin: (origin, callback: OriginCallback) => {
    // origin: HTTP request header value
    try {
      const isAllowed = allowedOrigins.includes(origin || '')
      callback(null, isAllowed)
    } catch (err) {
      callback(new Error('An error occurred during origin validation'))
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200,
}

app.use(cors(corsOptions))

app.get("/", (_req, res) => {
  res.send("My Spine: Powered by Node.js")
})

server.listen(process.env.PORT, () => {
  console.log(`Listening on port: ${port}!`)
})