import knex, { Knex } from 'knex'
import "dotenv/config"

type KnexConfig = { 
  [key: string]: Knex.Config 
}

const env = process.env.NODE_ENV || 'development'

const commonDBConfig = {
  client: 'sqlite3',
  useNullAsDefault: true,
  migrations: { 
    extension: 'ts',
    directory: '../src/db/migrations' 
  },
  seeds: { 
    directory: './src/db/seeds' 
  }
}

const knexfile: KnexConfig = {
  development: {
    connection: { 
      filename: '../src/db/dev.sqlite3.db'
    },
    ...commonDBConfig
  },
  production: {
    connection: { 
      filename: '../src/db/prod.sqlite3.db' 
    },
    ...commonDBConfig
  },
  test: {
    connection: { 
      filename: '../src/db/test.sqlite3.db' 
    },
    ...commonDBConfig
  }
}

const db: Knex = knex(knexfile[env])
export default db;