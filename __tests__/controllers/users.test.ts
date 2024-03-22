import { app } from '../../src/server'
import { User, UserToken, IUser } from '../../src/models'
import knex, { Knex } from 'knex'
import knexConfig from '../../knexfile'
import request from 'supertest'
import { generateToken } from '../../src/middleware'
import argon2 from 'argon2'

describe("users controller", () => {
  let db: Knex;
  let mockUserId: number = 696
  let users: IUser[] = [];
  let token: string = generateToken({ userId: mockUserId })
  let userRoute = '/users'

  beforeEach(async() => {
    db = knex(knexConfig)

    if (db) {
      await db('users').truncate()
    }

    await User.create({
      email: 'wwhite@msn.com', 
      password: 'heisenberg'
    })

    await User.create({
      email: 'pinkman.abq@yahoo.com', 
      password: 'margolis'
    })

    await User.create({
      email: 'gus@pollohermanos.cl',
      password: 'laundromat'
    })

    users = await User.readAll()
  })

  describe("getUsers", () => {
    it("should GET all users", async() => {
      const res = await request(app)
        .get(userRoute)
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .accept('application/json')
        .expect(200)

      expect(res.body).toEqual(users)
    })

    it("should invoke InternalServerError on db query failture", async () => {
      jest.spyOn(db, 'select').mockRejectedValue(new Error('oops'));
      
      try {
        await request(app)
          .get(userRoute)
          .set('Authorization', `Bearer ${token}`)
          .set('Content-Type', 'application/json')
          .accept('application/json')
      } catch (err: any) {
        expect(err.status).toBe(500);
        expect(err.message).toEqual('Unable to Get Users');
      }
    });
  })

  describe("getUserById", () => {
    it("should GET a user by id", async () => {
      const userId = users[0].id
      const user = await User.readById(userId)
      const res = await request(app)
        .get(`${userRoute}/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .accept('application/json')
        .expect(200)

      expect(res.body).toEqual(user);
    })

    it("should invoke NotFoundError if user does not exist", async () => {
      try {
        await request(app)
          .get(`${userRoute}/${mockUserId}`)
          .set('Authorization', `Bearer ${token}`)
          .set('Content-Type', 'application/json')
          .accept('application/json');
      } catch (err: any) {
        expect(err.status).toBe(404);
        expect(err.message).toEqual(`User [${mockUserId}] not found`);
      }
    })
  
    it("should invoke InternalServerError on db query failure", async () => {
      jest.spyOn(db, 'first').mockRejectedValue(new Error('oops'));
  
      try {
        await request(app)
          .get(`${userRoute}/${users[0].id}`)
          .set('Authorization', `Bearer ${token}`)
          .set('Content-Type', 'application/json')
          .accept('application/json');
      } catch (err: any) {
        expect(err.status).toBe(500);
        expect(err.message).toEqual('Unable to Get User');
      }
    })
  })

  describe("postUser", () => {
    it("should POST a user", async () => {
      const payload = {
        email: 'mike@mafia.org',
        password: 'ticktickbooom'
      }

      const res = await request(app)
        .post(`${userRoute}/create`)
        .send(payload)
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .accept('application/json')
        .expect(201)

      const hash = await argon2.hash(payload.password)
      
      expect(res.body.email).toEqual(payload.email)
      expect(res.body.password).toBeDefined()
      expect(argon2.verify(hash, payload.password)).toBeTruthy()
    })
  
    it("should invoke NotFoundError if the user does not exist", async () => {
      try {
        await request(app)
          .get(`${userRoute}/${mockUserId}`)
          .set('Authorization', `Bearer ${token}`)
          .set('Content-Type', 'application/json')
          .accept('application/json');
      } catch (err: any) {
        expect(err.status).toBe(404);
        expect(err.message).toEqual(`User [${mockUserId}] not found`);
      }
    })
  
    it("should invoke InternalServerError on db query failure", async () => {
      jest.spyOn(db, 'first').mockRejectedValue(new Error('oops'));
  
      try {
        await request(app)
          .get(`${userRoute}/${users[0].id}`)
          .set('Authorization', `Bearer ${token}`)
          .set('Content-Type', 'application/json')
          .accept('application/json');
      } catch (err: any) {
        expect(err.status).toBe(500);
        expect(err.message).toEqual('Unable to Get User');
      }
    })
  })

  describe("putUser", () => {
    it("should PUT a user email and password", async () => { 
      const userId = users[2].id
      const payload = {
        email: 'mike@msn.com',
        password: 'palomita'
      }
      const updatedUser = await User.update(userId, payload)
      const hash = await argon2.hash(payload.password)

      const res = await request(app)
        .put(`${userRoute}/${userId}/update`)        
        .set('Authorization', `Bearer ${generateToken({ userId })}`)
        .set('Content-Type', 'application/json')
        .accept('application/json')
        .send(payload)
        .expect(201)

      expect(res.body.email).toEqual(updatedUser.email)
      expect(res.body.password).toBeDefined()
      expect(argon2.verify(hash, payload.password)).toBeTruthy()
    })
  
    it("should invoke NotFoundError if the user does not exist", async () => {
      try {
        await request(app)
          .get(`${userRoute}/${mockUserId}`)
          .set('Authorization', `Bearer ${token}`)
          .set('Content-Type', 'application/json' )
          .accept('application/json');
      } catch (err: any) {
        expect(err.status).toBe(404);
        expect(err.message).toEqual(`User [${mockUserId}] not found`);
      }
    })
  
    it("should invoke InternalServerError when the db query fails", async () => {
      jest.spyOn(db, 'first').mockRejectedValue(new Error('oops'));
  
      try {
        await request(app)
          .get(`${userRoute}/${users[0].id}`)
          .set('Authorization', `Bearer ${token}`)
          .set('Content-Type', 'application/json')
          .accept('application/json');
      } catch (err: any) {
        expect(err.status).toBe(500);
        expect(err.message).toEqual('Unable to Get User');
      }
    })
  })

  describe("deleteUser", () => {
    it("should DELETE a user and return a 200 status code", async () => {
      const userId = users[0].id;
      const res = await request(app)
        .delete(`/users/${userId}/delete`)
        .set("Content-Type", "application/json")
        .set("Authorization", `Bearer ${generateToken({ userId })}`)
  
      expect(res.status).toEqual(204)
      expect(res.body).toEqual({});
    })
  
    it("should invoke NotFoundError if the user does not exist", async () => {
      jest.spyOn(db, 'delete').mockRejectedValue(new Error('oops'));
      
      try {
        await User.delete(mockUserId);
        const res = await request(app)
          .delete(`/users/${mockUserId}/delete`)
          .set("Content-Type", "application/json")
          .set("Authorization", `Bearer ${generateToken({ userId: 1 })}`)
      } catch (err: any) {
        expect(err.status).toBe(404);
        expect(err.message).toEqual(`User [${mockUserId}] not found`);
      }
    })

    it("should invoke InternalServerError when the db query fails", async () => {
      jest.spyOn(db, 'delete').mockRejectedValue(new Error('oops'));

      try {
        await request(app)
          .get(`${userRoute}/${users[0].id}/delee`)
          .set('Authorization', `Bearer ${generateToken({ userId: mockUserId })}`)
          .set('Content-Type', 'application/json')
          .accept('application/json');
      } catch (err: any) {
        expect(err.status).toBe(500);
        expect(err.message).toEqual('Unable to Delete User');
      }
    })
  })

  describe("signIn", () => {
    it("should sign-in and return tokens", async() => {
      const user = users[1]
      const { id, email, password } = user
      const payload = { email, password }
      const token = generateToken({ userId: id })

      const res = await request(app)
        .post(`${userRoute}/signIn`)
        .send(payload)
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .accept('application/json')
        .expect(201)

      const userById = await User.readById(id)
      const userTokenById = await UserToken.readByUserId(id)

      expect(userById).toBeDefined()
      expect(userTokenById).toBeDefined()
      expect(userTokenById.access_token).toBeDefined()
      expect(userTokenById.refresh_token).toBeDefined()

      expect(res.body.email).toEqual(payload.email)
      expect(res.body.access_token).toBeDefined()
      expect(res.body.refresh_token).toBeDefined()
    });
  
    it("should return a 400 Bad Request if missing email/password", async () => {
    const res = await request(app)
      .post(`${userRoute}/signIn`)
      .send({})
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .accept('application/json')

      expect(res.status).toBe(400)
      expect(res.body.message).toEqual("Email & Password Required")
    })
  })
})