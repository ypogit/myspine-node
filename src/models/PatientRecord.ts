import knex from "knex"
import knexConfig from "../../knexfile"

export interface IPatientRecord {
  id: Number
  user_id: Number
  firstname: string
  lastname: string
  pain_description: string
  pain_degree: BigInteger
  address: string
  email: string,
  phone_number: string
}

const PATIENT_RECORDS_TABLE = 'patient_records'
const db = knex(knexConfig)

export class PatientRecord {
  static async create(patientRecord: Partial<IPatientRecord>): Promise<IPatientRecord> {
    const [patient]: IPatientRecord[] = await db(PATIENT_RECORDS_TABLE)
      .insert<IPatientRecord>({
        firstname: patientRecord.firstname,
        lastname: patientRecord.lastname,
        pain_description: patientRecord.pain_description,
        pain_degress: patientRecord.pain_degree,
        email: patientRecord.email,
        phone_number: patientRecord.phone_number
      })
      .returning('*')

    return patient
  }

  static async readByUserId(userId: number) {
    return await db(PATIENT_RECORDS_TABLE)
      .where('user_id', '=', userId)
      .first<IPatientRecord, Pick<IPatientRecord, "user_id">>()
  }

  static async update(userId: number, patientRecord: Partial<IPatientRecord>) {
    await db(PATIENT_RECORDS_TABLE)
      .where('user_id', '=', userId)
      .update<IPatientRecord>(patientRecord)

    const updatedPatientRecord = await PatientRecord.readByUserId(userId)
    return updatedPatientRecord
  }

  static async delete(userId: number) {
    return await db(PATIENT_RECORDS_TABLE)
      .where('user_id', '=', userId)
      .first<IPatientRecord, Pick<IPatientRecord, "user_id">>()
      .delete()
  }
}