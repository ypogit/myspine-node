import knex from "knex"
import knexConfig from '../../knexfile'
import { JwtPayload } from "src/utils/types"
import { IUser } from "./User"

export interface IUserToken {
  id: number,
  user_id: number,
  access_token: string,
  refresh_token: string,
  access_token_expires_at: Date,
  created_at: Date,
  updated_at: Date
}

export interface UserTokenResponse extends IUserToken {
  email: string
}

const USER_TOKENS_TABLE = 'user_tokens'
const db = knex(knexConfig)

export class UserToken {
  static async create(TokenBody: Partial<IUserToken>): Promise<IUserToken | null> {
    const {
      user_id,
      access_token,
      refresh_token
    } = TokenBody

    const [tokens] = await db(USER_TOKENS_TABLE)
      .insert<IUserToken>({
        user_id,
        access_token,
        refresh_token,
        access_token_expires_at: new Date(Date.now() + (
          Number(process.env.ACCESS_TOKEN_EXPIRES_AT) || 15 * 60 * 1000
        ))
      })
      .returning('*')
    return tokens
  }

  static async readByToken(decoded: JwtPayload): Promise<IUserToken> {
    return await db(USER_TOKENS_TABLE)
      .where('refresh_token', '=', decoded)
      .first<IUserToken>()
  }

  static async readByUserId(userId: number): Promise<IUserToken> {
    return await db(USER_TOKENS_TABLE)
      .where('user_id', '=', userId)
      .first<IUserToken, Pick<IUserToken, "id">>()
  }

  static async delete(userId: number) {
    return await db(USER_TOKENS_TABLE)
      .where('user_id', '=', userId)
      .first<IUserToken, Pick<IUserToken, 'id'>>()
      .delete()
  }
}