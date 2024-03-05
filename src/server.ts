import cors from 'cors'
import fs from 'fs'
import https from 'https'
import express, { 
  Application,
  Request, 
  Response 
} from 'express'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { 
  corsOptions, 
  helmetOptions, 
  limiterOptions 
} from './middleware'

const app: Application = express()
const port = process.env.PORT || 8443

const credentials = {
  key: fs.readFileSync(process.env.PRIVATE_KEY_PATH 
    || './certs/local-key.pem', 'utf8'),
  cert: fs.readFileSync(process.env.CERTIFICATE_PATH 
    || './certs/local-cert.pem', 'utf8')
}

app.use("/", (
  cors(corsOptions),
  helmet(helmetOptions),
  rateLimit(limiterOptions)
))

app.get("/", async (_req: Request, res: Response) => {
  res.send("Ouch my spine.")
})

const server = https.createServer(credentials, app);

server.listen(port, () => {
  console.log(`Listening on: https://localhost:${port}!`)
})