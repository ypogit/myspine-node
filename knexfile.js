// @ts-nocheck
const env = process.env.NODE_ENV || 'development'

const commonDBConfig = {
  client: 'sqlite3',
  useNullAsDefault: true,
  migrations: {
    directory: './src/db/migrations'
  },
  seeds: {
    directory: './src/db/seeds'
  }
}

const knexfile = {
  development: {
    ...commonDBConfig,
    connection: {
      filename: './src/db/dev.sqlite3.db'
    },
  },
  production: {
    ...commonDBConfig,
    connection: {
      filename: './src/db/prod.sqlite3.db'
    },
  },
  test: {
    ...commonDBConfig,
    connection: {
      filename: './src/db/test.sqlite3.db'
    },
  }
}

const knexConfig = knexfile[env]
export default knexConfig