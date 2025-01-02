import { 
  InternalServerError,
  NotFoundError,
} from '../utils/funcs/errors'
import { Controller } from '../utils/types/generic'
import { ICustomer, Customer } from '../models'
import { 
  capitalizeFirstLetter,
  sanitizeEmail,
  formatJsonField
} from '../utils/funcs/strings'
import { MailTypes, requestMail } from '../middleware'

export const customers: Controller = {
  getCustomers: async(_req, res) => {
    try {
      const customers: ICustomer[] = await Customer.readAll()
      res.status(200).json(customers)
    } catch (err) {
      InternalServerError("read", "customers", res, err)
    }
  },

  getCustomerById: async(req, res) => {
    try {
      const customerId: number = parseInt(req.params.id)
      const customer: ICustomer = await Customer.readById(customerId)

      if (!customer) {
        NotFoundError("customer", res)
      }

      res.status(200).json(customer)
    } catch (err: unknown) {
      InternalServerError("read", "customer", res, err)
    }
  },

  postCustomer: async(req, res) => {
    try {
      const { email, firstname, lastname, ...rest } = req.body
      const sanitizedEmail = sanitizeEmail(email)

      const customer: ICustomer = await Customer.create({
        firstname: capitalizeFirstLetter(firstname),
        lastname: capitalizeFirstLetter(lastname),
        email: sanitizedEmail,
        ...rest
      })

      if (customer) {
        const name = `${customer.firstname} ${customer.lastname}`

        requestMail({
          mailType: MailTypes.APPT_REQUESTED,
          from: {
            email: customer.email,
            name,
            id: customer.id
          },
          html: `<p>Greetings, Dr. Templin!<br/><br/>
          A customer has requested your consulation.<br/><br/>
            <b>Name: </b>${name}<br/>
            <b>Email: </b>${customer.email}<br/>
            <b>Phone number: </b>${customer.phone_number}<br/>
            <b>Age: </b>${customer.age ?? 'N/A'}<br/>
            <b>Sex: </b>${customer.sex ?? 'N/A'}<br/>
            <b>Height: </b>${customer.height ?? 'N/A'} cm<br/>
            <b>Weight: </b>${customer.weight ?? 'N/A'} kg<br/>
            <b>Occupation: </b>${customer.occupation ?? 'N/A'}<br/>
            <b>Acute Pain Type: </b>${customer.acute_pain_type ?? 'N/A'}<br/>
            <b>Pain Summary: </b>${formatJsonField(customer.pain_summary) ?? 'N/A'}<br/>
            <b>Pain Degree: </b>${customer.pain_degree ?? 'N/A'}<br/>
            <b>Pain Duration: </b>${customer.pain_duration ?? 'N/A'}<br/>
            <b>Pain Areas: </b>${formatJsonField(customer.pain_areas) ?? 'N/A'}<br/>
            <b>Pain Start Type: </b>${customer.pain_start_type ?? 'N/A'}<br/>
            <b>Pain Start Causes: </b>${formatJsonField(customer.pain_start_causes) ?? 'N/A'}<br/>
            <b>Physical Therapy History: </b>${customer.physical_therapy_history ?? 'N/A'}<br/>
            <b>Offered Spinal Surgery: </b>${customer.offered_spinal_surgery ?? 'N/A'}<br/>
            <b>Spine Imaging Types: </b>${formatJsonField(customer.spine_imaging_types) ?? 'N/A'}<br/>
            <b>Previous Spinal Surgery: </b>${customer.previous_spinal_surgery ?? 'N/A'}<br/>
            <b>Limb Weakness/Numbness: </b>${customer.limb_weakness_numbness ?? 'N/A'}<br/>
            <b>Walking Unsteadiness: </b>${customer.walking_unsteadiness ?? 'N/A'}<br/>
            <b>Offered Procedure: </b>${customer.offered_procedure ?? 'N/A'}<br/>
            <b>Offered By: </b>${customer.offered_by ?? 'N/A'}<br/>
            <b>Discussed Result: </b>${customer.discussed_result ?? 'N/A'}<br/>
            <b>Surgery Type: </b>${customer.surgery_type ?? 'N/A'}<br/>
            <b>Surgery Date/Time: </b>${customer.surgery_date_time ?? 'N/A'}<br/>
            <b>Surgeon: </b>${customer.surgeon ?? 'N/A'}<br/>
            <b>Hand/Object Manipulation Problem: </b>${customer.hand_object_manipulation_problem ?? 'N/A'}<br/>
            <b>Past Pain Medication: </b>${customer.past_pain_medication ?? 'N/A'}<br/>
            <b>Current Pain Medication: </b>${customer.current_pain_medication ?? 'N/A'}<br/>
            <b>Painful Activities: </b>${formatJsonField(customer.painful_activities) ?? 'N/A'}<br/>
            <b>Painful Leg Activities: </b>${formatJsonField(customer.painful_leg_activities) ?? 'N/A'}<br/>
            <b>Helpful Activities: </b>${formatJsonField(customer.helpful_activities) ?? 'N/A'}<br/>
            <b>Unoperational Due to Pain: </b>${customer.unoperational_due_to_pain ? 'Yes' : 'No'}<br/>
            <b>Physician Visit for Pain: </b>${customer.physician_visit_for_pain ?? 'N/A'}<br/>
            <b>Injection Procedure for Pain: </b>${customer.injection_procedure_for_pain ?? 'N/A'}<br/>
            <b>Injection Types: </b>${formatJsonField(customer.injection_types) ?? 'N/A'}<br/>
            <b>Injection Relief: </b>${customer.injection_relief ?? 'N/A'}<br/>
            <b>Helpful Injection: </b>${customer.helpful_injection ?? 'N/A'}<br/>
            <b>Injection Relief Duration: </b>${customer.injection_relief_duration ?? 'N/A'}<br/>
            <b>Medical Problem: </b>${customer.medical_problem ?? 'N/A'}<br/>
            <b>Current Medication: </b>${customer.current_medication ?? 'N/A'}<br/>
          </p>`
        })
      }
    } catch (err: unknown) {
      InternalServerError("create", "customer", res, err)
    }
  },

  deleteCustomer: async(req, res) => {
    try {
      const customerId: number | undefined = parseInt(req.params?.customerId)
      const customerDeleted: number = await Customer.delete(customerId)

      if (customerDeleted) {
        res.status(204).json(customerDeleted)
      } else {
        NotFoundError(`Customer ID: ${customerId}`, res)
      }

    } catch (err: unknown) {
      InternalServerError("delete", "customer", res, err)
    }
  }
}