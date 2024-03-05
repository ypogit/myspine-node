import { 
  Store,
  Options,
  IncrementResponse
} from 'express-rate-limit'
import { Knex } from 'knex'
import db from '../../knexfile'
import 'dotenv/config'

export default class SQLiteStore implements Store {
  protected db: Knex = db
  protected windowMs!: number // Milliseconds before hit counts reset

  constructor() {
    this.db = db
  }

  public init(options: Options): void {
    this.windowMs = options.windowMs
  }

  async increment(): Promise<IncrementResponse> {
    // db.schema.createTable('rate_limits', (table) => {
    //   table.increments('id').primary()
    //   table.integer('hits')
    // })
    return {
      totalHits: Number(process.env.LIMITER_LIMIT) || 5, // 5 requests per window,
      resetTime: new Date(Date.now() + Number(process.env.LIMITER_WINDOW) || 15 * 60 * 1000) // 15 minutes duration until reset
    }
  }

  async decrement(): Promise<void> {

  }

  async resetKey(): Promise<void> {

  }

  async resetAll(): Promise<void> {

  }
  
  // async increment(key: string): Promise<ClientRateLimitInfo> {
  //   return new Promise((resolve, reject) => {
  //     this.db.run('INSERT INTO rate_limits (key, hits) VALUES (?, 1) ON CONFLICT(key) DO UPDATE SET hits = hits + 1', [key], (err) => {
  //       if (err) {
  //         reject(err);
  //       } else {
  //         this.db.get('SELECT * FROM rate_limits WHERE key = ?', [key], (err, row) => {
  //           if (err) {
  //             reject(err);
  //           } else { 
  //             resolve({
  //               totalHits: Number(process.env.LIMITER_LIMIT) || 5, // Assuming a total limit of 5 requests per window
  //               resetTime: new Date(Date.now() + Number(process.env.LIMITER_WINDOW) || 15 * 60 * 1000) // Assuming a window of 15 minutes
  //             });
  //           }
  //         });
  //       }
  //     });
  //   })
  // }

  // async decrement(key: string): Promise<void> {
  //   return new Promise((resolve, reject) => {
  //     this.db.run('UPDATE rate_limits SET hits = hits - 1 WHERE key = ?', [key], (err) => {
  //       if (err) {
  //         reject(err);
  //       } else {
  //         resolve();
  //       }
  //     });
  //   });
  // }

  // async resetKey(key: string): Promise<void> {
  //   return new Promise((resolve, reject) => {
  //     this.db.run('DELETE FROM rate_limits WHERE key = ?', [key], (err) => {
  //       if (err) {
  //         reject(err);
  //       } else {
  //         resolve();
  //       }
  //     });
  //   });
  // }
}