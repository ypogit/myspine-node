import { 
  Store,
  IncrementResponse
} from 'express-rate-limit'
import knex, { Knex } from 'knex'
import knexConfig from '../../knexfile'

// TODO: error, rejected promises handling

export default class SQLiteStore implements Store {
  protected db: Knex
  protected windowMs!: number // Milliseconds before hit counts reset

  constructor() {
    this.db = knex(knexConfig)
    this.windowMs = Number(process.env.LIMITER_WINDOW) || 15 * 60 * 1000 // 15 minutes
  }
  async increment(key: string): Promise<IncrementResponse> {
    const now = Date.now()
    const resetTime = now + this.windowMs

    // INSERT INTO rate_limits (key, hits) VALUES (?, 1) 
    // ON CONFLICT(key) DO UPDATE SET hits = hits + 1'
    await this.db('rate_limits') 
          .insert({ key, hits: 1 })
          .onConflict('key')
          .merge({ hits: this.db.raw('hits + 1') })

    return {
      totalHits: Number(process.env.LIMITER_LIMIT) || 5, // 5 requests per window,
      resetTime: new Date(resetTime)
    }
  }

  async decrement(key: string): Promise<void> {
    // UPDATE rate_limits SET hits = hits - 1 WHERE key = ?'
    await this.db('rate_limits')
          .where({ key })
          .update({ hits: this.db.raw('hits - 1') })
  }

  async resetKey(key: string): Promise<void> {
    // DELETE FROM rate_limits WHERE key = ?'
    await this.db('rate_limits')
          .where({ key })
          .delete()
  }

  async resetAll(): Promise<void> {
    await this.db('rate_limits')
          .del()
  }
}