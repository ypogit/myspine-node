import knex from "knex"
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
  static async create({ email, password }: Partial<IUser>): Promise<IUser | null> {
    
    const existingUser = await db(USERS_TABLE)
      .where({ email })
      .first()

    if (existingUser) {
      throw new Error("Email already in use")
    }

    const [user]: IUser[] = await db(USERS_TABLE)
      .insert<IUser>({ email, password }) // .insert binds parameters
      .returning('*')
    return user
  }

  static async readAll() {
    return await db(USERS_TABLE)
      .select<IUser[]>('*')
  }

  static async readById(userId: number) {
    return await db(USERS_TABLE)
      .where('id', '=', userId)
      .first<IUser, Pick<IUser, "id">>()
  }

  static async readByEmail(email: string): Promise<IUser | undefined> {
    return await db(USERS_TABLE)
      .where('email', '=', email)
      .first()
  }

  static async update(userId: number, userData: Partial<IUser>) {
    const payload: { [key:string]: string } = {}

    if (userData.email) {
      payload.email = userData.email
    }

    if  (userData.password) {
      payload.password = userData.password
    }

    await db(USERS_TABLE)
      .where('id', '=', userId)
      .update<IUser>(payload) // .where() && .update() does not bind parameters

    const updatedUser = await User.readById(userId)
    return updatedUser
  }
  
  static async delete(userId: number) {
    return await db(USERS_TABLE)
      .where('id', '=', userId)
      .first<IUser, Pick<IUser, 'id'>>()
      .delete()
  }
}