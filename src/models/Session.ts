import knex from "knex"
import knexConfig from '../../knexfile'

export interface ISession {
  sid: string,
  sess: string
}

const SESSIONS_TABLE = 'sessions'
const db = knex(knexConfig)

export class Session {
  static async readById(sessionId: number) {
    return await db(SESSIONS_TABLE)
      .where('sid', '=', String(sessionId))
      .first<ISession, Pick<ISession, "sid">>()
  }
}