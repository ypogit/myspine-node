import knex, { Knex } from "knex"
import knexConfig from '../../knexfile'

export interface IUser {
  id: number,
  email: string,
  password: string,
  created_at: Date,
  updated_at: Date
}

const USERS_TABLE = 'users'
const db = knex(knexConfig)

export class User {
  static async create({ email, password }: Partial<IUser>): Promise<IUser> {
    const [user]: IUser[] = await db(USERS_TABLE)
      .insert<IUser>({ email, password })
      .returning('*')
    return user
  }

  static async readAll() {
    const users = await db(USERS_TABLE)
      .select<IUser[]>('*')
    return users
  }
}