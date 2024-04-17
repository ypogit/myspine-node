import cors from 'cors'
import fs from 'fs'
import https from 'https'
import express, { Application } from 'express'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import session from 'express-session'
import { 
  corsOptions,
  helmetOptions, 
  limiterOptions,
  sessionOptions,
  requireJwt
} from './middleware'
import routes from './routes'

export const app: Application = express()

const port = process.env.PORT || 8443
const credentials = {
  key: fs.readFileSync(process.env.PRIVATE_KEY_PATH 
    || './certs/local-key.pem', 'utf8'),
  cert: fs.readFileSync(process.env.CERTIFICATE_PATH 
    || './certs/local-cert.pem', 'utf8')
}

app.use(express.json())
app.use("/login", (session(sessionOptions)))

routes.forEach(({ path, router }) => {
  app.use(path, router)
})

app.use("/", (
  rateLimit(limiterOptions),
  requireJwt,
  cors(corsOptions),
  helmet(helmetOptions)
))

export const server = https.createServer(credentials, app);

server.listen(port, () => {
  console.log(`Listening on: https://localhost:${port}!`)
})