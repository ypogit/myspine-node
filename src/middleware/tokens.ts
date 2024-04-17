import crypto from 'crypto'
import fs from 'fs'
import jwt, { SignOptions } from 'jsonwebtoken'
import knex from 'knex'
import knexConfig from '../../knexfile'
import { 
  InternalServerError, 
  UnauthorizedRequestError 
} from '../utils/funcs/errors'
import { v4 } from 'uuid'
import { UserToken, IUser, IUserToken } from '../models'
import { JwtPayload } from 'src/utils/types/generic'
import { UserTokenResponse } from 'src/models/UserToken'

const db = knex(knexConfig)
const USER_TOKENS_TABLE: string = 'user_tokens'

export const privateKey = crypto.createPrivateKey({
  key: fs.readFileSync(process.env.PRIVATE_KEY_PATH 
    || './certs/local-key.pem', 'utf8'),
  format: 'pem'
})

const publicKey = crypto.createPublicKey({
  key: fs.readFileSync(process.env.PRIVATE_KEY_PATH
  || './certs/local-key.pem', 'utf-8'),
  format: 'pem'
})

export const generateToken = (userId: number, expiresIn?: string | number) => {
  const payload =  { id: v4(), userId }
  const options: SignOptions = { 
    algorithm: 'RS256', 
    expiresIn: expiresIn || '1h'
  }

  return jwt.sign(payload, privateKey, options)
}

export const verifyToken = async (token: string): Promise<JwtPayload> => {
  return await new Promise<JwtPayload>((resolve, reject) => {
    jwt.verify(token, publicKey, (err, decoded) => {
      if (err) {
        err.name === 'JsonWebTokenError' && err.message === 'invalid signature' ?
          reject(new Error('Invalid token signature')) :
          reject(err)
      }
      resolve(decoded as JwtPayload);
    })
  })
}

export const requireJwt = async(req: any, res: any, next: any) => {
  try {
    const authorizationHeader = req.headers.authorization
    
    if (!authorizationHeader) {
      throw new Error('Authorization header is missing')
    }

    const token = authorizationHeader.split(' ')[1]
    const decoded = await verifyToken(token)

    req.user = decoded
    next()
  } catch(err) {
    UnauthorizedRequestError('token', res)
  }
}

export const handleLoginTokens = async(userId: number, _req: any, res: any): Promise<Partial<IUserToken> | null | undefined> => {
  const expiresIn = res.body?.expiresIn
  const accessToken = generateToken(
    userId, 
    expiresIn || '15m'
  ) 
  const refreshToken = generateToken(userId) // Stay logged-in
  
  try {
    const existingTokens = await db(USER_TOKENS_TABLE)
      .where('user_id', '=', userId)
      .first<UserToken>()

    if (existingTokens && existingTokens.access_token_expires_at > new Date(Date.now())) {
      // Skip insertion if user already has valid tokens
      return { 
        access_token: accessToken, 
        refresh_token: refreshToken 
      }
    }

    const tokens = await UserToken.create({
      user_id: userId,
      access_token: accessToken,
      refresh_token: refreshToken
    })

    return { 
      access_token: tokens?.access_token, 
      refresh_token: tokens?.refresh_token 
    }
  } catch (err) {
    InternalServerError("login", "user", res)
    return null
  }
}

export const handleLogoutTokens = async(userId: number, res: any) => {
  try {
    const userToken = await UserToken.readByUserId(userId)

    if (!userToken) {
      UnauthorizedRequestError("refresh token", res)
    } else {
      await UserToken.delete(userId)
      res.status(204).end()
    }
  } catch (err) {
    InternalServerError("logout", "user", res)
  }
}