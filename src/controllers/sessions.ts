import argon2 from 'argon2'
import { 
  BadRequestError,
  InternalServerError,
  UnauthorizedRequestError,
  NotFoundError
} from '../utils/funcs/errors'
import { Controller } from '../utils/types/generic'
import { IUserToken, User } from '../models'
import { 
  handleLoginTokens, 
  handleLogoutTokens,
  handleSessionData
} from '../middleware'
import { SessionData } from 'src/utils/types/express-session'

type LoginTokenResponse = {
  access_token?: string,
  refresh_token?: string
}

export const sessions: Controller = {
  login: async(req, res) => { 
    try {
      const { email, password } = req.body

      if (!email && !password) {
        BadRequestError("email & password", res)
      }

      if (!email) {
        BadRequestError("email", res)
      }

      if (!password) {
        BadRequestError("password", res)
      }

      const userByEmail = await User.readByEmail(email)
      
      if (!userByEmail) {
        NotFoundError("user", res)
      } 
      
      const hashedPass = await argon2.hash(password)

      if (!hashedPass) {
        UnauthorizedRequestError("password", res)
        res.status(302).redirect('/password/forget')
      }

      const userId = userByEmail!.id
      
      const tokens: LoginTokenResponse | null | undefined = await handleLoginTokens(userId, req, res)

      const sessions: SessionData | undefined = await handleSessionData(userId, req, res)
      
      if (tokens && sessions) {
        res.status(201).json({
          ...userByEmail,
          ...tokens,
          session_data: sessions 
        })
      }
    } catch (err: unknown) {
      InternalServerError("login", "user account", res)
    }
  },

  logout: async(req, res) => {
    try {
      const userId = req.body.id
      await handleLogoutTokens(userId, res)
      
      req.session.destroy()

      res.send("Successfully logging out")
      res.redirect('/login')
    } catch (err: Error | unknown) {
      InternalServerError("logout", "user", res)
    }
  },

  // forgetPassword: async(req, res) => {

  // },

  // resetPassword: async(req, res) => {
    
  // }
}