import argon2 from 'argon2'
import { 
  BadRequestError,
  InternalServerError,
  UnauthorizedRequestError,
  NotFoundError
} from '../utils/funcs/errors'
import { Controller } from '../utils/types/generic'
import { User, UserToken } from '../models'
import { 
  handleLoginTokens, 
  handleLogoutTokens,
  handleSessionData
} from '../middleware'
import { SessionData } from 'src/utils/types/express-session'
import { 
  generateResetToken,
  emailPasswordReset 
} from '../middleware'

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

      const user = await User.readByEmail(email)
      
      if (!user) {
        NotFoundError("user", res)
        res.status(302).redirect('/password/forget')
      } 
      
      const hashedPass = await argon2.hash(password)

      if (!hashedPass) {
        UnauthorizedRequestError("password", res)
        res.status(302).redirect('/password/forget')
      }

      const userId = user!.id
      
      const tokens: LoginTokenResponse | null | undefined = await handleLoginTokens(userId, req, res)

      const sessions: SessionData | undefined = await handleSessionData(userId, req, res)
      
      if (tokens && sessions) {
        res.status(201).json({
          ...user,
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

  forgetPassword: async(req, res) => {
    const email = req.body
    const clientURL = process.env.CLIENT_URL

    try {
      const user = await User.readByEmail(email)

      if (!user) {
        BadRequestError("email", res)
      }

      const userId = user!.id
      const resetToken = await generateResetToken()

      if (!resetToken) {
        throw new Error("Unable to generate reset token")
      }

      await UserToken.update(userId, resetToken)

      const resetURL = `${clientURL}/passwordReset?token=${resetToken}&id=${userId}`

      emailPasswordReset(user!.email, resetURL)

      res.status(201).json({ message: "Password reset successfully requested" })
    } catch (err: Error | unknown) {
      InternalServerError("update", "password", res)
    }
  },

  resetPassword: async(req, res) => {
    try {
      const {
        resetToken, 
        userId, 
        password 
      } = req.body

      if (!resetToken) {
        BadRequestError("reset token", res)
      }

      if (!userId) {
        BadRequestError("user", res)
      }

      if (!password) {
        BadRequestError("password", res)
      }

      const user = await UserToken.readByUserId(userId)

      if (!user) {
        NotFoundError("user", res)
      }

      // await UserToken.update({ })
    
    } catch (err: Error | unknown) {
      InternalServerError("update", "password", res)
    }
  }
}