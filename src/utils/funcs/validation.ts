export const validatePayload = ({ payload, requiredFields }: { payload: { [key: string]: any }, requiredFields: string[] }) => {
  for (const field of requiredFields) {
    if (!payload[field]) {
      throw new Error(`Invalid request: ${field} is required`)
    }
  }
}