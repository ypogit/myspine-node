export const capitalizeFirstLetter = (str: string): string => {
  return str.replace(/\b\w/g, match => match.toUpperCase());
}

export const sanitizeEmail = (email: string) => {
  return email.trim().toLowerCase()
}