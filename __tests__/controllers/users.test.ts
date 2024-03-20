import { app } from '../../src/server'
import { User, IUser } from '../../src/models'
import knex, { Knex } from 'knex'
import knexConfig from '../../knexfile'
import request from 'supertest'
import { generateToken } from '../../src/middleware'

describe("users controller", () => {
  let db: Knex;
  let userRoute: string;
  let mockUserId: number;
  let users: IUser[] = [];
  let date: Date  | undefined;

  beforeEach(async() => {
    db = knex(knexConfig)

    if (db) {
      await db('users').truncate()
    }

    mockUserId = 696
    userRoute = '/users'

    const user1 = await User.create({
      email: 'wwhite@msn.com', 
      password: 'ricin'
    })
    const user2 = await User.create({
      email: 'pinkman.abq@yahoo.com', 
      password: 'margolis'
    })
    const user3 = await User.create({
      email: 'gus@pollohermanos.cl',
      password: 'laundromat'
    })
  })

  describe("getUsers", () => {
    it("should GET all users", async() => {
      const users = await User.readAll()      
      const token = generateToken({ userId: mockUserId })
      const res = await request(app)
        .get(userRoute)
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .accept('application/json')

      expect(res.status).toBe(200)
      expect(res.body).toEqual(users)
    })

    it("should invoke InternalServerError on GET all users fails", async() => {
      jest.spyOn(db, 'select').mockRejectedValue(new Error('oops'))

      try {
        await request(app).get(userRoute)
      } catch (err: any) {
        expect(err.status).toBe(500)
        expect(err.message).toEqual('Failed to Get Users')
      }
    })
  })
})