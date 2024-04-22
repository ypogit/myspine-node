export const containsMissingFields = ({ payload, requiredFields }: { 
  payload: { [key: string]: any }, 
  requiredFields: string[],
}): string | undefined => {
  let missingFields: string[] = []
  
  for (const field of requiredFields) {
    if (!payload[field]) {
      missingFields.push(field)
    }
  }

  if (missingFields.length > 0) {
    return missingFields.join(', ')
  }

  return undefined
}