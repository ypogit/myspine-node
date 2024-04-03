import argon2 from 'argon2'
import { 
  BadRequestError,
  InternalServerError,
  UnauthorizedRequestError,
  NotFoundError
} from '../utils/funcs/errors'
import { Controller } from '../utils/types/generic'
import { User } from '../models'
import { 
  handleLoginTokens, 
  handleLogoutTokens 
} from '../middleware/tokens'
import { SessionData } from '../utils/types/express-session'

export const sessions: Controller = {
  // protect: async (req, res) => {
  //   try {
  //     localStorage.setItem('sessionId', res.sessionId)
  //     // TODO: Persistent session storage, not localStorage

  //     const userId = (req.session as SessionData).userId
  //     res.send(`User Id ${userId} have already logged in`)
  //   } catch (err) {
  //     UnauthorizedRequestError("session", res)
  //   }
  // },
 
  login: async (req, res) => {
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
      } else {

        const hashedPass = await argon2.hash(password)

        hashedPass
          ? handleLoginTokens(userByEmail, req, res)
          : UnauthorizedRequestError("password", res)
      }
    } catch (err: unknown) {
      InternalServerError("login", "user account", res)
    }
  },

  logout: async (req, res) => {
    try {
      const userId = req.body.id
      await handleLogoutTokens(userId, res)
      
      req.session.destroy()

      res.send("Successfully logging out")
      res.redirect('/login')
    } catch (err: Error | unknown) {
      InternalServerError("logout", "user", res)
    }
  }
}