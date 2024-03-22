import cors from 'cors'
import fs from 'fs'
import https from 'https'
import express, {
  Application,
  Request,
  Response,
  Router
} from 'express'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { 
  corsOptions,
  helmetOptions, 
  limiterOptions,
  requireJwt 
} from './middleware'
import routes from './routes'

export const app: Application = express()

app.use(express.json())
routes.forEach(({ path, router }) => {
  app.use(path, router)
})

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
  rateLimit(limiterOptions),
  requireJwt
))

app.get("/", async (_req: Request, res: Response) => {
  res.send("Ouch my spine.")
})

const server = https.createServer(credentials, app);

server.listen(port, () => {
  console.log(`Listening on: https://localhost:${port}!`)
})