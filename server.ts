import cors, { CorsOptions } from 'cors'
import express from 'express'
import expressLimiter from 'express-limiter'
import fs from 'fs'
import https from 'https'
import helmet, { HelmetOptions } from 'helmet'
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

const helmetOptions: HelmetOptions = {
  contentSecurityPolicy: {
    // Mitigate many attacks, preventing XXS
    directives:  helmet.contentSecurityPolicy.getDefaultDirectives()
    // Default values
      // default-src: 'self'
      // base-uri: 'self'
      // font-src: 'self' https: data:
      // form-action: 'self'
      // frame-ancestors: 'self'
      // img-src: 'self' data:
      // object-src: 'none'
      // script-src: 'self'
      // script-src-attr: 'none'
      // style-src: 'self' https: 'unsafe-inline'
      // upgrade-insecure-requests
  },
  crossOriginEmbedderPolicy: { policy: 'require-corp' },
  // Controls what resources can be loaded x-origin
  // Requires all x-origin resources loaded within the page's content use CORS
  crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
  // Protect against x-origin window and iframes related attacks
  // Allow document to be accessed by documents from the same origin
  // And allow document from x-origin iframes to open popups
  crossOriginResourcePolicy: { policy: 'same-origin' },
  // Browser blocks no-cros x-origin/ x-site requests to the same origin
  strictTransportSecurity: { 
  // Browser prefers HTTPS
  // Default values
      // maxAge: 155520000 (180 days)
      // includeSubdomains: true
    preload: true 
    // Add HSTS policy to browser
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xPoweredBy: false,
  // Remove xPowered by that Express.js sets by default
  // Obscure tech stack slowing down the recon phase of the attack
  // Other default options:
    // xContentTypeOptions: nosniff
    // xDnsPrefetchControl: off
    // xXssProtection: 0
}

app.use(
  cors(corsOptions), 
  helmet(helmetOptions)
)

app.get("/", (_req, res) => {
  res.send("Ouch my spine.")
})

server.listen(process.env.PORT, () => {
  console.log(`Listening on port: ${port}!`)
})