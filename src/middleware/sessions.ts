import crypto from 'crypto'
import knexConfig from '../../knexfile'
import session from 'express-session'
import BetterSQLite3 from 'better-sqlite3'
import BetterSQLite3SessionStore from 'better-sqlite3-session-store'
import { NextFunction } from 'express'
import { SessionData } from '../utils/types/express-session'

type SessionStoreOptions = {
  client: any,
  expired: {
    clear: boolean,
    intervalMs: number
  }
}

type SessionOptions = {
  secret: string,
  genid: () => string,
  cookie: {
    secure: boolean,
    maxAge: number
  },
  saveUninitialized: boolean,
  resave: boolean,
  store: any
}

export const sessionData = async(req: any, _res: any, next: NextFunction) => {
  console.log('here')
  const sessionData = req.session as SessionData
  console.log(sessionData)
  if (sessionData && sessionData.userId) {
    sessionData.loggedIn = true;
    sessionData.userId = sessionData.userId;
  }
  next();
}

const SQLiteStore = BetterSQLite3SessionStore(session)
const sessionsDb = new BetterSQLite3(knexConfig.connection.filename)
const secret =  process.env.SESSION_SECRET || crypto.randomBytes(64).toString()
const sessionId = crypto.randomBytes(16).toString('hex')


export const sessionStoreOptions: SessionStoreOptions = {
  client: sessionsDb,
  expired: {
    clear: true,
    intervalMs: Number(process.env.SESSION_STORE_INTERVAL_MS) || 900000
  }
}

// At the time of this annotation, many default values for express-session have been deprecated
export const sessionOptions: SessionOptions = {
  secret,
  genid: () => sessionId,
  cookie: {
    secure: true, // Using HTTPS
    maxAge: Number(process.env.SESSION_COOKIE_MAX_AGE) 
      || 24 * 60 * 60 * 1000  // Expires in 1 day
  },
  saveUninitialized: false, //  No cookies on a response with an uninitialized session
  resave: false, // Force save the unmodified session to the session store
  store: new SQLiteStore(sessionStoreOptions)
}

