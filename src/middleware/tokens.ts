import crypto from 'crypto'
import jwt, { SignOptions } from 'jsonwebtoken'
import { 
  InternalServerError,
  UnauthorizedRequestError 
} from '../utils/funcs/errors'
import { v4 } from 'uuid'
import { UserToken, IUserToken } from '../models'
import { JwtPayload } from 'src/utils/types/generic'
import argon2 from 'argon2'

const secret = process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex')

export const generateToken = ({ userId, expiresIn }: { userId: number, expiresIn?: string }) => {
  const payload =  { id: v4(), userId }
  const options: SignOptions = { 
    algorithm: 'HS256', 
    expiresIn: expiresIn || '1h'
  }

  const token = jwt.sign(payload, secret, options)
  return token
}

export const verifyToken = async (token: string): Promise<JwtPayload> => {
  return await new Promise<JwtPayload>((resolve, reject) => {
    jwt.verify(token, secret, (err, verifiedToken) => {
      if (err) {
        err.name === 'JsonWebTokenError' && err.message === 'invalid signature' 
          ? reject(new Error('Invalid token signature')) 
          : reject(err)
      }
      resolve(verifiedToken as JwtPayload);
    })
  })
}

export const generateResetToken = async() => {
  const resetToken = crypto.randomBytes(20).toString('hex')
  const expirationDate = new Date()

  expirationDate.setHours(expirationDate.getHours() + 24) // Expires in 24h

  return {
    reset_password_token: await argon2.hash(resetToken),
    reset_password_token_expiration_date: expirationDate
  }
}

export const requireJwt = async (req: any, res: any, next: any) => {
  try {
    let token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;

    // If not in header, check for cookies
    if (!token) {
      token = req.cookies.token;
    }

    if (!token) {
      throw new Error('No token provided');
    }

    const verifiedToken = await verifyToken(token);

    // Use the actual token string not the decoded & verified payload
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 3600000 
    });
  
    req.user = verifiedToken;
    next();
  } catch (err) {
    UnauthorizedRequestError('token', res, err);
  }
};

export const handleLoginTokens = async(userId: number, _req: any, res: any): Promise<Partial<IUserToken> | undefined> => {
  const accessToken = generateToken({ userId, expiresIn: '15m' }) 
  const refreshToken = generateToken({ userId, expiresIn: '1d' }) // Stay logged-in
  
  try {
    const existingTokens = await UserToken.readByUserId(userId)

    if (existingTokens && existingTokens.access_token_expires_at > new Date(Date.now())) {
      // Skip insertion if user already has valid tokens
      return { 
        access_token: existingTokens.access_token, 
        refresh_token: existingTokens.refresh_token 
      }
    }

    const tokens = await UserToken.create({
      user_id: userId,
      access_token: accessToken,
      refresh_token: refreshToken
    })

    if (!tokens) {
      return undefined;
    }

    return { 
      access_token: tokens?.access_token, 
      refresh_token: tokens?.refresh_token 
    }
  } catch (err) {
    InternalServerError("login", "user", res, err)
    return undefined
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
    InternalServerError("logout", "user", res, err)
  }
}