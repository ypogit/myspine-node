import knex from "knex"
import knexConfig from "../../knexfile";

export interface ICustomer {
  id: number; // Primary key
  user_id?: number; // Foreign key to the users table
  firstname: string;
  lastname: string;
  email: string;
  phone_number: number;
  is_consented: boolean;
  age: number;
  sex: string;
  height: number;
  weight: number;
  occupation: string;
  acute_pain_type: string;
  pain_summary: string; // JSON stringified object
  pain_degree: number;
  pain_duration: string;
  activity_level: string;
  pain_areas: string; // JSON stringified array
  pain_start_type: string;
  pain_start_causes: string; // JSON stringified array
  physical_therapy_history: string;
  offered_spinal_surgery: string;
  spine_imaging_types: string; // JSON stringified array
  previous_spinal_surgery: string;
  limb_weakness_numbness: string;
  walking_unsteadiness: string;
  offered_procedure: string;
  offered_by: string;
  discussed_result: string;
  surgery_type: string;
  surgery_date_time: string; // ISO8601 date-time string
  surgeon: string;
  hand_object_manipulation_problem: string;
  past_pain_medication: string;
  current_pain_medication: string;
  painful_activities: string; // JSON stringified array
  painful_leg_activities: string; // JSON stringified array
  helpful_activities: string; // JSON stringified array
  unoperational_due_to_pain: boolean;
  physician_visit_for_pain: string;
  injection_procedure_for_pain: string;
  injection_types: string; // JSON stringified array
  injection_relief: string;
  helpful_injection: string;
  injection_relief_duration: string;
  medical_problem: string;
  current_medication: string;
  password: string; // Assuming password storage as a hash
}

const CUSTOMERS_TABLE = 'customers'
const db = knex(knexConfig)

export class Customer {
  static async create(customerData: ICustomer): Promise<ICustomer> {
    const [customer]: ICustomer[] = await db(CUSTOMERS_TABLE)
      .insert<ICustomer>(customerData)
      .returning('*')
    return customer
  }

  static async readAll() {
    return await db(CUSTOMERS_TABLE)
      .select<ICustomer[]>('*')
  }

  static async readById(userId: number) {
    return await db(CUSTOMERS_TABLE)
      .where('user_id', '=', userId)
      .first<ICustomer, Pick<ICustomer, "user_id">>()
  }

  static async update({ customerId, payload }: { customerId: number, payload: Partial<ICustomer>}) {
    await db(CUSTOMERS_TABLE)
      .where('id', '=', customerId)
      .update<ICustomer>(payload)

    const updatedCustomerRecord = await Customer.readById(customerId)
    return updatedCustomerRecord
  }

  static async delete(id: number) {
    return await db(CUSTOMERS_TABLE)
      .where('id', '=', id)
      .first<ICustomer, Pick<ICustomer, "id">>()
      .delete()
  }
}