import { Session } from 'express-session'
declare module 'express-session';

interface SessionData extends Session {
  logged_in?: boolean
  user_id?: number
}