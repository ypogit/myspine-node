import { 
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from '../utils/funcs/errors'
import { Controller } from '../utils/types/generic'
import { User, IUser } from '../models'
import { IPatientRecord, PatientRecord } from 'src/models/PatientRecord'
import { validatePayload } from 'src/utils/funcs/validation'

export const patients: Controller = {
  getPatientByUserId: async (req, res) => {
    try {
      const userId: number = parseInt(req.params.id)
      const userById: IUser = await User.readById(userId)

      if (!userById) {
        NotFoundError("patient", res)
      }

      const patientRecord: IPatientRecord = await PatientRecord.readByUserId(userId)
      res.status(200).json(patientRecord)
    } catch (err: unknown) {
      InternalServerError("get", "user", res)
    }
  },

  postPatient: async (req, res) => {
    try {
      const userId = req.params.id
      let {
        firstname,
        lastname,
        pain_description,
        pain_degree,
        address,
        phone_number
      } = req.body
      const requiredFields = ['firstname', 'lastname', 'pain_description', 'pain_degree']

      validatePayload({ payload: req.body, requiredFields })
      
      const { email } = await User.readById(userId)

      if (!phone_number && !email) {
        BadRequestError("number or email", res)
      }

      if ((!email || phone_number) || (!phone_number || email)) {
        const patientRecord = await PatientRecord.create({ firstname, lastname, pain_description, pain_degree, address, phone_number })
        res.status(201).json(patientRecord)
      } else {
        res.redirect('/login')
        res.locals.warning(`User with email: ${email} already exists`)
      }
    } catch (err: Error | unknown) {
      InternalServerError("create", "user", res)
    }
  },

  putPatient: async (req, res) => {
    try {
      const userId = req.params.id
      let {
        firstname,
        lastname,
        pain_description,
        pain_degree,
        address,
        phone_number
      } = req.body
      const requiredFields = ['firstname', 'lastname', 'pain_description', 'pain_degree']

      validatePayload({ payload: req.body, requiredFields })
      
      const { email } = await User.readById(userId)

      if (!phone_number && !email) {
        BadRequestError("number or email", res)
      }

      if ((!email || phone_number) || (!phone_number || email)) {
        const patientRecord = await PatientRecord.create({ firstname, lastname, pain_description, pain_degree, address, phone_number })
        res.status(201).json(patientRecord)
      }
    } catch (err: Error | unknown) {
      InternalServerError("update", "user", res)
    }
  },

  deletePatient: async (req, res) => {
    try {
      const patientId: number = parseInt(req.params.id)
      const patientDeleted: number  = await PatientRecord.delete(patientId)

      if (patientDeleted) {
        res.status(204).json(patientDeleted)
      } else {
        NotFoundError(`Patient ID: ${patientId}`, res)
      }
    } catch (err: unknown) {
      InternalServerError("delete", "patient", res)
    }
  }
}