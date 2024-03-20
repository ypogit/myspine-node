import crypto from 'crypto'
import fs from 'fs'
import jwt, { SignOptions } from 'jsonwebtoken'
import knex from 'knex'
import knexConfig from '../../knexfile'
import { GenerateTokenConfig, JwtPayload } from "../utils/types"
import { 
  InternalServerError, 
  UnauthorizedRequestError 
} from '../utils/funcs/errors'
import { v4 } from 'uuid'
import { UserToken } from 'src/models'

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

export const generateToken = (config: GenerateTokenConfig) => {
  const { userId } = config
  const payload =  { id: v4(), userId }
  const options: SignOptions = { 
    algorithm: 'RS256', 
    expiresIn: config.expiresIn || '1h'
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

export const handleSignInTokens = async(userId: number, res: any) => {
  const accessToken = generateToken({ userId, expiresIn: '15m' })
  const refreshToken = generateToken({ userId }) // Stay logged-in

  try {
    const existingTokens = await db(USER_TOKENS_TABLE)
      .where('user_id', '=', userId)
      .first<UserToken>()

    if (existingTokens && existingTokens.access_token_expires_at > new Date(Date.now())) {
      // Skip insertion if user already has valid tokens
      res.status(200).json({ accessToken, refreshToken })
      return
    }

    await db(USER_TOKENS_TABLE)
      .insert<UserToken>({
        user_id: userId,
        access_token: accessToken,
        refresh_token: refreshToken,
        access_token_expires_at: new Date(Date.now() + (
          Number(process.env.ACCESS_TOKEN_EXPIRES_AT) || 15 * 60 * 1000
        ))
      })

    res.status(200).json({ accessToken, refreshToken })
  } catch (err) {
    InternalServerError("sign-in", "user", res)
  }
}

export const handleSignOutTokens = async(refreshToken: string, res: any) => {
  try {
    const decoded = await verifyToken(refreshToken)
    const userToken: UserToken = await db(USER_TOKENS_TABLE)
      .where('refresh_token', '=', decoded)
      .first<UserToken>()

    if (!userToken) {
      UnauthorizedRequestError("refresh token", res)
    } else {
      await db(USER_TOKENS_TABLE)
        .where('user_id', userToken.user_id)
        .del<UserToken>()

      res.status(204).end()
    }
  } catch (err) {
    InternalServerError("sign-out", "user", res)
  }
}