import crypto from 'crypto'
import knexConfig from '../../knexfile'
import session from 'express-session'
import BetterSQLite3 from 'better-sqlite3'
import BetterSQLite3SessionStore from 'better-sqlite3-session-store'
import { SessionData } from '../utils/types/express-session'
import { SessionOptions } from 'express-session'

type SessionStoreOptions = {
  client: any,
  expired: {
    clear: boolean,
    intervalMs: number
  }
}

// type SessionOptions = {
//   secret: string,
//   genid?: () => string,
//   cookie: {
//     secure: boolean,
//     maxAge: number,
//     httpOnly: boolean,
//     path: string,
//     sameSite: boolean | "none" | "strict" | "lax" | undefined
//   },
//   saveUninitialized: boolean,
//   resave: boolean,
//   store: any
// }

const SQLiteStore = BetterSQLite3SessionStore(session, {
  table: 'sessions',
  createTable: true // Ensures timestamps on row creation
})
const sessionsDb = new BetterSQLite3(knexConfig.connection.filename)
const sessionSecret =  process.env.SESSION_SECRET || crypto.randomBytes(64).toString('hex')
// const sessionId = crypto.randomBytes(16).toString('hex')

export const sessionStoreOptions: SessionStoreOptions = {
  client: sessionsDb,
  expired: {
    clear: true,
    intervalMs: Number(process.env.SESSION_STORE_INTERVAL_MS) || 900000 // 15 minutes
  }
}

// At the time of this annotation, many default values for express-session have been deprecated
export const sessionOptions: SessionOptions = {
  secret: sessionSecret,
  // TODO: maybe put back after testing with Dropbox OAuth
  // genid: () => sessionId,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Using HTTPS in prod only
    maxAge: Number(process.env.SESSION_COOKIE_MAX_AGE) 
      || 24 * 60 * 60 * 1000,  // Expires in 1 day or 864000000ms
    httpOnly: true,
    path: '/',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
  },
  saveUninitialized: true, //  No cookies on a response with an uninitialized session
  resave: false, // Force save the unmodified session to the session store
  store: new SQLiteStore(sessionStoreOptions),
}

export const handleSessionData = async(userId: number, req: any, _res: any) => {
  const sessionData = req.session as SessionData
  
  if (sessionData) {
    sessionData.logged_in = true;
    sessionData.user_id = userId;
    // await SQLiteStore.destroy(sessionData.id);
  }

  return sessionData;
}