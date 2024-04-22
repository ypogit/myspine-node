import { app, server } from '../../src/server'
import { Patient, IPatient } from '../../src/models'
import knex, { Knex } from 'knex'
import knexConfig from '../../knexfile'
import request from 'supertest'
import { generateToken } from '../../src/middleware'

describe("patients controller", () => {
  let db: Knex;
  let mockUserId: number = 696
  let token: string = generateToken(mockUserId)
  let patientRoute = '/patients'

  const truncateDb = async() => {
    if (db) {
      await db('patients').truncate()
    }
  }
  
  const terminateServer = async() => {
    await new Promise<void>((resolve) => {
      server.close(() => {
        resolve()
      })
    })
  }

  describe("getPatientByUserId", () => {
    it("should GET a patient by id", async () => {
      await Patient.create({
        firstname: 'Walter',
        lastname: 'White',
        pain_description: 'acute pain',
        pain_degree: 10,
        address: 'New Mexico',
        email: 'wwhite@msn.com',
        phone_number: 5053334567
      })
  
      await Patient.create({
        firstname: 'Jesse',
        lastname: 'Pinkman',
        pain_description: 'second opinion',
        pain_degree:3,
        address: 'New Mexico',
        email: 'jpinkman.abq@yahoo.com',
        phone_number: 5054445678
      })

      const gus = await Patient.create({
        firstname: 'Gustavo',
        lastname: 'Fring',
        pain_description: 'chronic pain',
        pain_degree: 8,
        address: '',
        email: 'gus@polloshermanos.cl',
        phone_number: 5053334567
      })
      
      const patient = await Patient.readById(gus.id)
      const res = await request(app)
        .get(`${patientRoute}/${patient.id}`)
        .set('Authorization', `Bearer ${token}`)
        .set('Content-Type', 'application/json')
        .accept('application/json')
        .expect(200)

      expect(res.body).toEqual(patient);
    })

  //   it("should invoke NotFoundError if user does not exist", async () => {
  //     try {
  //       await request(app)
  //         .get(`${userRoute}/${mockUserId}`)
  //         .set('Authorization', `Bearer ${token}`)
  //         .set('Content-Type', 'application/json')
  //         .accept('application/json');
  //     } catch (err: any) {
  //       expect(err.status).toBe(404);
  //       expect(err.message).toEqual(`User [${mockUserId}] not found`);
  //     }
  //   })
  
  //   it("should invoke InternalServerError on db query failure", async () => {
  //     await User.create({
  //       email: 'wwhite@msn.com', 
  //       password: 'ricin'
  //     })

  //     const users = await User.readAll()
  //     const userId = users[0].id

  //     jest.spyOn(db, 'first').mockRejectedValue(new Error('oops'));
  
  //     try {
  //       await request(app)
  //         .get(`${userRoute}/${userId}`)
  //         .set('Authorization', `Bearer ${token}`)
  //         .set('Content-Type', 'application/json')
  //         .accept('application/json');
  //     } catch (err: any) {
  //       expect(err.status).toBe(500);
  //       expect(err.message).toEqual('Unable to Get User');
  //     }
  //   })
  })

  // describe("postUser", () => {
  //   beforeEach(async() => {
  //     await truncateDb()
  //     await terminateServer()
  //   })

  //   it("should POST a user", async () => {
  //     const payload = {
  //       email: 'mike@mafia.org',
  //       password: 'ticktickbooom'
  //     }

  //     const res = await request(app)
  //       .post(`${userRoute}/create`)
  //       .send(payload)
  //       .set('Authorization', `Bearer ${token}`)
  //       .set('Content-Type', 'application/json')
  //       .accept('application/json')
  //       .expect(201)

  //     const hash = await argon2.hash(payload.password)
      
  //     expect(res.body.email).toEqual(payload.email)
  //     expect(res.body.password).toBeDefined()
  //     expect(argon2.verify(hash, payload.password)).toBeTruthy()
  //   })

  //   it.todo("should redirect to login if the user email already exists")
  
  //   it("should invoke NotFoundError if the user does not exist", async () => {
  //     try {
  //       await request(app)
  //         .get(`${userRoute}/${mockUserId}`)
  //         .set('Authorization', `Bearer ${token}`)
  //         .set('Content-Type', 'application/json')
  //         .accept('application/json');
  //     } catch (err: any) {
  //       expect(err.status).toBe(404);
  //       expect(err.message).toEqual(`User [${mockUserId}] not found`);
  //     }
  //   })
  
  //   it("should invoke InternalServerError on db query failure", async () => {
  //     await User.create({
  //       email: 'wwhite@msn.com', 
  //       password: 'ricin'
  //     })

  //     const users = await User.readAll()
  //     const userId = users[0].id

  //     jest.spyOn(db, 'first').mockRejectedValue(new Error('oops'));
  
  //     try {
  //       await request(app)
  //         .get(`${userRoute}/${userId}`)
  //         .set('Authorization', `Bearer ${token}`)
  //         .set('Content-Type', 'application/json')
  //         .accept('application/json');
  //     } catch (err: any) {
  //       expect(err.status).toBe(500);
  //       expect(err.message).toEqual('Unable to Get User');
  //     }
  //   })
  // })

  // describe("putUser", () => {
  //   beforeEach(async() => {
  //     await truncateDb()
  //     await terminateServer()
  //   })

  //   it("should PUT a user email and password", async () => { 
  //     await User.create({
  //       email: 'wwhite@msn.com', 
  //       password: 'ricin'
  //     })
  
  //     await User.create({
  //       email: 'pinkman.abq@yahoo.com', 
  //       password: 'margolis'
  //     })
  
  //     await User.create({
  //       email: 'gus@pollohermanos.cl',
  //       password: 'laundromat'
  //     })
  
  //     const users = await User.readAll()
  //     const userId = users[2].id
  //     const payload = {
  //       email: 'mike@msn.com',
  //       password: 'palomita'
  //     }
  //     const updatedUser = await User.update(userId, payload)
  //     const hash = await argon2.hash(payload.password)

  //     const res = await request(app)
  //       .put(`${userRoute}/${userId}/update`)        
  //       .set('Authorization', `Bearer ${generateToken(userId)}`)
  //       .set('Content-Type', 'application/json')
  //       .accept('application/json')
  //       .send(payload)
  //       .expect(201)

  //     expect(res.body.email).toEqual(updatedUser.email)
  //     expect(res.body.password).toBeDefined()
  //     expect(argon2.verify(hash, payload.password)).toBeTruthy()
  //   })
  
  //   it("should invoke NotFoundError if the user does not exist", async () => {
  //     try {
  //       await request(app)
  //         .get(`${userRoute}/${mockUserId}`)
  //         .set('Authorization', `Bearer ${token}`)
  //         .set('Content-Type', 'application/json' )
  //         .accept('application/json');
  //     } catch (err: any) {
  //       expect(err.status).toBe(404);
  //       expect(err.message).toEqual(`User [${mockUserId}] not found`);
  //     }
  //   })
  
  //   it("should invoke InternalServerError when the db query fails", async () => {
  //     await User.create({
  //       email: 'wwhite@msn.com', 
  //       password: 'ricin'
  //     })
  //     const users = await User.readAll()
  //     const userId = users[0].id

  //     jest.spyOn(db, 'first').mockRejectedValue(new Error('oops'));
  
  //     try {
  //       await request(app)
  //         .get(`${userRoute}/${userId}`)
  //         .set('Authorization', `Bearer ${token}`)
  //         .set('Content-Type', 'application/json')
  //         .accept('application/json');
  //     } catch (err: any) {
  //       expect(err.status).toBe(500);
  //       expect(err.message).toEqual('Unable to Get User');
  //     }
  //   })
  // })

  // describe("deleteUser", () => {
  //   beforeEach(async() => {
  //     await truncateDb()
  //     await terminateServer()
  //   })

  //   it("should DELETE a user and return a 200 status code", async () => {
  //     await User.create({
  //       email: 'wwhite@msn.com', 
  //       password: 'ricin'
  //     })
  
  //     const users = await User.readAll()
  //     const userId = users[0].id;

  //     const res = await request(app)
  //       .delete(`/users/${userId}/delete`)
  //       .set("Content-Type", "application/json")
  //       .set("Authorization", `Bearer ${generateToken(userId)}`)
  
  //     expect(res.status).toEqual(204)
  //     expect(res.body).toEqual({});
  //   })
  
  //   it("should invoke NotFoundError if the user does not exist", async () => {
  //     jest.spyOn(db, 'delete').mockRejectedValue(new Error('oops'));
      
  //     try {
  //       await User.delete(mockUserId);
  //       await request(app)
  //         .delete(`/users/${mockUserId}/delete`)
  //         .set("Content-Type", "application/json")
  //         .set("Authorization", `Bearer ${token}`)
  //     } catch (err: any) {
  //       expect(err.status).toBe(404);
  //       expect(err.message).toEqual(`User [${mockUserId}] not found`);
  //     }
  //   })

  //   it("should invoke InternalServerError when the db query fails", async () => {
  //     await User.create({
  //       email: 'wwhite@msn.com', 
  //       password: 'ricin'
  //     })
  
  //     const users = await User.readAll()
  //     const userId = users[0].id;
      
  //     jest.spyOn(db, 'delete').mockRejectedValue(new Error('oops'));

  //     try {
  //       await request(app)
  //         .get(`${userRoute}/${userId}/delete`)
  //         .set('Authorization', `Bearer ${token}`)
  //         .set('Content-Type', 'application/json')
  //         .accept('application/json');
  //     } catch (err: any) {
  //       expect(err.status).toBe(500);
  //       expect(err.message).toEqual('Unable to Delete User');
  //     }
  //   })
  // })
})