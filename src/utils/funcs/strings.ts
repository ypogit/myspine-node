export const capitalizeFirstLetter = (str: string): string => {
  return str.replace(/\b\w/g, match => match.toUpperCase());
}

export const sanitizeEmail = (email: string) => {
  return email.trim().toLowerCase()
}

export const formatJsonField = (jsonString: string) => {
  try {
    const parsed = JSON.parse(jsonString)

    if (Array.isArray(parsed)) {
      return parsed.join(', ')
    }
    return jsonString
  } catch {
    return jsonString
  }
}