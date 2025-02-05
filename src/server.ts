import cors from 'cors'
import express, { Application } from 'express'
import helmet from 'helmet'
import http from 'http'
import knex from "knex"
import knexConfig from "../knexfile"
import rateLimit from 'express-rate-limit'
import routes from './routes'
import session from 'express-session'
import shutdown from 'http-graceful-shutdown'
import { 
  corsOptions,
  helmetOptions, 
  limiterOptions,
  sessionOptions,
  requireJwt
} from './middleware'

export const app: Application = express()

const db = knex(knexConfig)
const dev_env = process.env.NODE_ENV || 'development'
const env = process.env.NODE_ENV
const port = process.env.PORT || 3000

// Applied following middleware before routes to ensure handling before requests
app.use(express.json())
app.use(cors(corsOptions))
app.use(session(sessionOptions))

routes.forEach(({ path, router }) => {
  app.use(path, router)
})

app.use("/", (
  rateLimit(limiterOptions),
  requireJwt,
  helmet(helmetOptions)
))

// This is for local development only, incoming HTTPS requests will be handled by NGINX
export const server = http.createServer(app)

const teardown = async() => {
  const tables = ['users', 'user_tokens', 'customers']
  try {
    console.log('Starting teardown')
    if (env === dev_env) {
      for (const table of tables) {
        await db(table).truncate()
      }
    }
    await db.destroy()
    console.log('Database connection closed')
  } catch (err) {
    console.error('Error tearing down database connection:', err)
  }
}

server.listen(port, () => {
  console.log(`Listening on: http://localhost:${port}!`)
})

shutdown(server, {
  signals: 'SIGINT SIGTERM',
  timeout: 10000,
  onShutdown: teardown,
})