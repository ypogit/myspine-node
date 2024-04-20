import { 
  InternalServerError,
  NotFoundError,
} from '../utils/funcs/errors'
import { Controller } from '../utils/types/generic'
import { User, IUser } from '../models'
import { IPatientRecord, PatientRecord } from '../models/PatientRecord'
import { validatePayload } from '../utils/funcs/validation'
import { sanitizeEmail } from '../utils/funcs/strings'
import { requestMail } from '../middleware'

export const patients: Controller = {
  getPatientByUserId: async (req, res) => {
    try {
      const userId: number = parseInt(req.params.id)
      const user: IUser = await User.readById(userId)

      if (!user) {
        NotFoundError("patient", res)
      }

      const patientRecord = await PatientRecord.readByUserId(userId)
      res.status(200).json(patientRecord)
    } catch (err: unknown) {
      InternalServerError("get", "user", res)
    }
  },

  postPatient: async (req, res) => {
    try {
      let {
        firstname,
        lastname,
        pain_description,
        pain_degree,
        address,
        email,
        phone_number
      } = req.body

      validatePayload({ 
        payload: req.body, 
        requiredFields: ['firstname', 'lastname', 'pain_description', 'pain_degree', 'email', 'phone_number'],
        res
      })

      const sanitizedEmail = sanitizeEmail(email)
      const patientRecord = await PatientRecord.create({ 
        firstname, 
        lastname, 
        pain_description, 
        pain_degree, 
        address, 
        email: sanitizedEmail, 
        phone_number 
      })

      if (patientRecord) {
        requestMail({
          mailType: 'appointment_requested',
          from: sanitizedEmail,
          content: `<!DOCTYPE html>
          <html>
          <head>
            <style>
              .bold-text {
                font-weight: bold;
              }
            </style>
          </head>
          <body>
            <p>
              <span class="bold-text">Greetings,</span> Doctor!<br><br>
              The following patient has requested an appointment with you.<br><br>
              <span class="bold-text">Name:</span> ${firstname} ${lastname}<br>
              <span class="bold-text">Pain description:</span> ${pain_description}<br>
              <span class="bold-text">Pain degree:</span> ${pain_degree}<br>
              <span class="bold-text">Address:</span> ${address || 'N/A'}<br>
              <span class="bold-text">Email:</span> ${email}<br>
              <span class="bold-text">Phone number:</span> ${phone_number}<br>
            </p>
          </body>
          </html>` 
        })
      }

      res.status(201).json(patientRecord)
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
        email,
        phone_number
      } = req.body

      const patient = await PatientRecord.readByUserId(userId)
      
      if (!patient) {
        throw new Error('User does not exist')
      }

      let payload: Partial<IPatientRecord> = {}

      if (firstname) {
        payload.firstname = firstname
      }

      if (lastname) {
        payload.lastname = lastname
      }

      if (pain_description) {
        payload.pain_description = pain_description
      }

      if (pain_degree) {
        payload.pain_degree = pain_degree
      }

      if (address) {
        payload.address = address
      }

      if (email) {
        payload.email = sanitizeEmail(email)
      }

      if (phone_number) {
        payload.phone_number = phone_number
      }

      const patientRecord = await PatientRecord.update(userId, payload)
      res.status(201).json(patientRecord)
    } catch (err: Error | unknown) {
      InternalServerError("update", "user", res)
    }
  },

  deletePatient: async (req, res) => {
    try {
      const patientId: number = parseInt(req.params.id)
      const patientDeleted: number = await PatientRecord.delete(patientId)

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