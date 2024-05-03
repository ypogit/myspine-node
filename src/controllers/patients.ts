import { 
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from '../utils/funcs/errors'
import { Controller } from '../utils/types/generic'
import { IPatient, Patient } from '../models'
import { containsMissingFields } from '../utils/funcs/validation'
import { 
  capitalizeFirstLetter, 
  sanitizeEmail 
} from '../utils/funcs/strings'
// import { requestMail } from '../middleware'

export const patients: Controller = {
  getPatientById: async (req, res) => {
    try {
      const patientId: number = parseInt(req.params.id)
      const patient = await Patient.readById(patientId)

      if (!patient) {
        NotFoundError("patient", res)
      }

      res.status(200).json(patient)
    } catch (err: unknown) {
      InternalServerError("get", "user", res, err)
    }
  },

  postPatient: async (req, res) => {
    try {
      let {
        user_id,
        firstname,
        lastname,
        pain_description,
        pain_degree,
        address,
        email,
        phone_number
      } = req.body

      const missingFields = containsMissingFields({
        payload: req.body,
        requiredFields: ['firstname', 'lastname', 'pain_description', 'pain_degree', 'email', 'phone_number']
      })

      if (missingFields) {
        return BadRequestError(missingFields, res) 
      }

      const patient = await Patient.create({ 
        user_id,
        firstname: capitalizeFirstLetter(firstname),
        lastname: capitalizeFirstLetter(lastname), 
        pain_description: capitalizeFirstLetter(pain_description), 
        pain_degree, 
        address, 
        email: sanitizeEmail(email), 
        phone_number 
      })

      // TODO: PUT BACK. Find SMPT connection service provider
      // if (Patient) {
      //   requestMail({
      //     mailType: 'appointment_requested',
      //     from: sanitizedEmail,
      //     content: `<!DOCTYPE html>
      //     <html>
      //     <head>
      //       <style>
      //         .bold-text {
      //           font-weight: bold;
      //         }
      //       </style>
      //     </head>
      //     <body>
      //       <p>
      //         <span class="bold-text">Greetings,</span> Doctor!<br><br>
      //         The following patient has requested an appointment with you.<br><br>
      //         <span class="bold-text">Name:</span> ${patient.firstname} ${patient.lastname}<br>
      //         <span class="bold-text">Pain description:</span> ${patient.pain_description}<br>
      //         <span class="bold-text">Pain degree:</span> ${patient.pain_degree}<br>
      //         <span class="bold-text">Address:</span> ${patient.address || 'N/A'}<br>
      //         <span class="bold-text">Email:</span> ${patient.email}<br>
      //         <span class="bold-text">Phone number:</span> ${patient.phone_number}<br>
      //       </p>
      //     </body>
      //     </html>` 
      //   })
      // }

      res.status(201).json(patient)
    } catch (err: Error | unknown) {
      InternalServerError("create", "user", res, err)
    }
  },

  putPatient: async (req, res) => {
    try {
      const patientId = parseInt(req.params.id)
      let {
        user_id,
        firstname,
        lastname,
        pain_description,
        pain_degree,
        address,
        email,
        phone_number
      } = req.body

      const patient = await Patient.readById(patientId)
      
      if (!patient) {
        throw new Error('User does not exist')
      }

      let payload: Partial<IPatient> = {}

      if (user_id) {
        payload.user_id = user_id
      }

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
        const missingFields = containsMissingFields({ 
          payload: req.body, 
          requiredFields: ['firstname', 'lastname', 'pain_description', 'pain_degree', 'email', 'phone_number'],
        })

        missingFields && BadRequestError(missingFields, res)
      }

      const updatedPatient = await Patient.update({ patientId, payload })
      res.status(201).json(updatedPatient)
    } catch (err: Error | unknown) {
      InternalServerError("update", "user", res, err)
    }
  },

  deletePatient: async (req, res) => {
    try {
      const patientId: number = parseInt(req.params.id)
      const patientDeleted: number = await Patient.delete(patientId)

      if (patientDeleted) {
        res.status(204).json(patientDeleted)
      } else {
        NotFoundError(`Patient ID: ${patientId}`, res)
      }
    } catch (err: unknown) {
      InternalServerError("delete", "patient", res, err)
    }
  }
}