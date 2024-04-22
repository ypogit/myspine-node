import knex from "knex"
import knexConfig from "../../knexfile"
import { capitalizeFirstLetter, sanitizeEmail } from "../utils/funcs/strings"

export interface IPatient {
  id: number,
  user_id?: number,
  firstname: string,
  lastname: string,
  pain_description: string,
  pain_degree: number,
  address: string,
  email: string,
  phone_number: number
}

const PATIENTS_TABLE = 'patients'
const db = knex(knexConfig)

export class Patient {
  static async create(patientData: Partial<IPatient>): Promise<IPatient> {
    const [patient]: IPatient[] = await db(PATIENTS_TABLE)
      .insert<IPatient>(patientData)
      .returning('*')
    return patient
  }

  static async readById(patientId: number) {
    return await db(PATIENTS_TABLE)
      .where('id', '=', patientId)
      .first<IPatient, Pick<IPatient, "id">>()
  }

  static async update(patientId: number, patientData: Partial<IPatient>) {
    const payload: Partial<IPatient> = {}

    if (patientData.firstname) {
      payload.firstname = capitalizeFirstLetter(patientData.firstname)
    }

    if (patientData.lastname) {
      payload.lastname = capitalizeFirstLetter(patientData.lastname)
    }

    if (patientData.pain_description) {
      payload.pain_description = patientData.pain_description
    }

    if (patientData.pain_degree) {
      payload.pain_degree = patientData.pain_degree
    }

    if (patientData.address) {
      payload.address = patientData.address
    }

    if (patientData.email) {
      payload.email = sanitizeEmail(patientData.email)
    }

    if (patientData.phone_number) {
      payload.phone_number = patientData.phone_number
    }

    await db(PATIENTS_TABLE)
      .where('id', '=', patientId)
      .update<IPatient>(payload)

    const updatedPatientRecord = await Patient.readById(patientId)
    return updatedPatientRecord
  }

  static async delete(id: number) {
    return await db(PATIENTS_TABLE)
      .where('id', '=', id)
      .first<IPatient, Pick<IPatient, "id">>()
      .delete()
  }
}