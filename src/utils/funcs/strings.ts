export const capitalizeFirstLetter = (str: string): string => {
  return str.replace(/\b\w/g, match => match.toUpperCase());
}