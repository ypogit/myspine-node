import cors from 'cors'
import express, { Application } from 'express'
import fs from 'fs'
import helmet from 'helmet'
import https from 'https'
import knex from "knex"
import knexConfig from "../knexfile"
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

const credentials = {
  key: fs.readFileSync(process.env.PRIVATE_KEY_PATH 
    || './certs/local-key.pem', 'utf8'),
  cert: fs.readFileSync(process.env.CERTIFICATE_PATH 
    || './certs/local-cert.pem', 'utf8')
}
const db = knex(knexConfig)
const dev_env = 'development'
const env = process.env.NODE_ENV
const port = process.env.PORT

app.use(express.json())
app.use("/login", (
  session(sessionOptions)
))

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

const teardown = async() => {
  try {
    console.log('Starting teardown');
    const tables = await db.raw('PRAGMA table_info(sqlite_master)');
    const tableNames = (tables.rows || [])
      .filter((row: any) => row.type === 'table')
      .map((row: any) => row.name);
    await Promise.all(tableNames.map((tableName: string) => db(tableName).truncate()));
    console.log('Tables truncated');
    await db.destroy();
    console.log('Database connection closed');
  } catch (err) {
    console.error('Error tearing down:', err);
  }
}

process.on('SIGINT', async() => {
  if (env === dev_env) {
    await teardown()
  }
  process.exit(0)
})

server.listen(port, () => {
  console.log(`Listening on: https://localhost:${port}!`)
})