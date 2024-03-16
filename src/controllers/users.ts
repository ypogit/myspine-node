import argon2 from 'argon2'
import knex, { Knex } from 'knex'
import knexConfig from '../../knexfile'
import { 
  BadRequestError,
  ExternalServerError,
  InternalServerError,
  InvalidRequestError,
  NotFoundError
} from '../utils/funcs/errors'
import { Controller } from '../utils/types'
import { User } from '../models'
import { handleSignInTokens } from 'src/middleware/tokens'

const db: Knex = knex(knexConfig)
const USERS_TABLE: string = 'users'

export const users: Controller = {
  getUsers: async (_req, res) => {
    try {
      const users = await db.select("*").from<User>(USERS_TABLE)
      res.json(users)
    } catch (err) {
      InternalServerError("get", "user", res)
    }
  },

  getUserById: async (req, res) => {
    try {
      const userId: number = parseInt(req.params.id)
      const userById = await db(USERS_TABLE)
        .where('id', userId)
        .first<User, Pick<User, "id">>()

      if (userById) {
        res.json(userById)
      } else {
        NotFoundError("user", res)
      }

    } catch (err: unknown) {
      InternalServerError("get", "user", res)
    }
  },

  postUser: async (req, res) => {
    try {
      const { email, password } = req.body
      
      if (password) {
        const hashedPass: string = await argon2.hash(password)
        req.body.password = hashedPass
      } else {
        BadRequestError("password", res)
      }

      const userPayload: User | undefined  = await db(USERS_TABLE)
        .insert<User>({ email, password })

      res.status(201).json(userPayload)
    } catch (err: unknown) {
      InternalServerError("post", "user", res)
    }
  },

  putUser: async (req, res) => {
    try {
      const userId: number = parseInt(req.params.id)
      const { email, password } = req.body
      
      if (password) {
        const hashedPass = await argon2.hash(password)
        hashedPass ? 
          ExternalServerError("argon2 hashing", res) : 
          req.body.password = hashedPass
      } else {
        BadRequestError("password", res)
      }

      const userPayload: User  = await db(USERS_TABLE)
        .where('id', userId)
        .update<User>({ email, password })

      if (userPayload) {
        res.json(userPayload)
      } else {
        NotFoundError(`User ID: ${userId}`, res)
      }
      
    } catch (err: unknown) {
      InternalServerError("put", "user", res)
    }
  },

  deleteUser: async (req, res) => {
    try {
      const userId: number = parseInt(req.params.id)
      const userToDelete: User[]  = await db(USERS_TABLE)
        .where('id', userId)
        .first<User, Pick<User, 'id'>>()
        .delete()

      if (userToDelete) {
        res.json(userToDelete)
      } else {
        NotFoundError(`User ID: ${userId}`, res)
      }

    } catch (err: unknown) {
      InternalServerError("delete", "user", res)
    }
  },

  signIn: async (req, res) => {
    try {
      const { email, password } = req.body
  
      if (!email || !password) {
        BadRequestError("email and password", res)
      }
  
      const userByEmail: User | undefined = await db<User>("*")
        .from<User>(USERS_TABLE)
        .where('email', email)
        .first()
  
      if (!userByEmail) {
        NotFoundError("user", res)
      } else {
        const isPasswordValid: boolean = await argon2.verify(password, userByEmail.password)
        const userId = userByEmail.id

        isPasswordValid ? 
          handleSignInTokens(userId, res) :
          InvalidRequestError("password", res)
      }    
    } catch (err: unknown) {
      InternalServerError("get", "user account", res)
    }
  },

  signOut: async (req, res) => {
    const { refreshToken } = req.body

    await handleSignInTokens(refreshToken, res)
    res.redirect('/signIn')
  }
}