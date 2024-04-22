import argon2 from 'argon2'
import { 
  BadRequestError,
  InternalServerError,
  UnauthorizedRequestError,
  NotFoundError,
  ExternalServerError
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
  requestMail
} from '../middleware'
import { containsMissingFields } from '../utils/funcs/validation'
import { sanitizeEmail } from '../utils/funcs/strings'

type LoginTokenResponse = {
  access_token?: string,
  refresh_token?: string
}

export const sessions: Controller = {
  login: async(req, res) => { 
    try {
      const { email, password } = req.body

      const missingFields = containsMissingFields({
        payload: req.body,
        requiredFields: ['email', 'password'],
      })

      if (missingFields) {
        BadRequestError(missingFields, res)
      }

      const sanitizedEmail = sanitizeEmail(email)
      const user = await User.readByEmail(sanitizedEmail)
      
      if (!user) {
        NotFoundError("user", res)
        res.status(302).redirect('/login')
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
      const userId = parseInt(req.body.userId)
      await handleLogoutTokens(userId, res)
      
      req.session.destroy()

      res.send("Successfully logging out")
      res.redirect('/login')
    } catch (err: Error | unknown) {
      InternalServerError("logout", "user", res)
    }
  },

  forgotPassword: async(req, res) => {
    const { email } = req.body
    const clientURL = process.env.CLIENT_URL

    try {
      const sanitizedEmail = sanitizeEmail(email)
      const user = await User.readByEmail(sanitizedEmail)

      if (!user) {
        BadRequestError("email", res)
      }

      const userId = user!.id
      const {
        reset_password_token,
        reset_password_token_expiration_date
      } = await generateResetToken()

      if (!reset_password_token) {
        throw new Error("Unable to generate reset token")
      }

      await UserToken.create({ 
        user_id: userId, 
        reset_password_token,
        reset_password_token_expiration_date
      })

      const resetURL = `${clientURL}/passwordReset?token=${reset_password_token}&userId=${userId}`

      requestMail({
        mailType: 'reset_pass_requested',
        to: user!.email,
        from: undefined,
        url: resetURL
      })

      res.status(201).json({ message: "Password reset successfully requested" })
    } catch (err: Error | unknown) {
      InternalServerError("update", "password", res)
    }
  },

  resetPassword: async(req, res) => {
    try {
      const { reset_password_token, user_id, password } = req.body

      const missingFields = containsMissingFields({
        payload: req.body,
        requiredFields: ['reset_password_token', 'user_id', 'password'],
      })

      if (missingFields) {
        BadRequestError(missingFields, res)
      }

      const hashedPass: string | undefined = await argon2.hash(password)
  
      if (!hashedPass) {
        ExternalServerError("argon 2 hashing", res)
      }

      const userData = { password: hashedPass }
      const user = await User.update(user_id, userData)

      if (!user) {
        InternalServerError("update", "user", res)
      }

      const userToken = await UserToken.readByUserId(user_id)

      if (!userToken) {
        NotFoundError("user token", res)
      }

      const exp = userToken.reset_password_token_expiration_date
      const isTokenUnexpired = exp && (exp > new Date(Date.now())
)
      if (reset_password_token === userToken.reset_password_token && isTokenUnexpired) {
        await UserToken.updateResetToken({ userId: user_id, resetToken: undefined })
      }

      requestMail({
        mailType: 'reset_pass_completed',
        to: user!.email,
        from: undefined
      })
      
      res.status(200).json({ message: "Password reset successfully" })
    } catch (err: Error | unknown) {
      InternalServerError("update", "password", res)
    }
  }
}