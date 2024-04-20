import { BadRequestError } from "./errors"

export const validatePayload = ({ payload, requiredFields, res }: { 
  payload: { [key: string]: any }, 
  requiredFields: string[], 
  res: any 
}) => {
  let missingFields: string[] = []
  
  for (const field of requiredFields) {
    if (!payload[field]) {
      missingFields.push(field)
    }
  }

  if (missingFields.length > 0) {
    BadRequestError(`${missingFields.join(", ")}`, res);
  }
}