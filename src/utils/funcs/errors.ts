import { capitalizeFirstLetter } from './strings'

/** 
 * These error handling functions implement an empty "return" 
 * to exit the async-await promise functions
 */

export const BadRequestError = (category: string, res: any) => {
  res.status(400).json({ 
    message: `${capitalizeFirstLetter(category)} Required` 
  })
  return;
}

export const UnauthorizedRequestError = (category: string, res: any) => {
  res.status(401).json({
    message: `Unauthorized: Invalid ${capitalizeFirstLetter(category)}`
  })
  return;
}

export const NotFoundError = (category: string, res: any) => {
  res.status(404).json({ 
    message: `${capitalizeFirstLetter(category)} Not Found` 
  })
}

export const ExternalServerError = (category: string, res: any) => {
  res.status(500).json({ 
    message: `Something went wrong with ${capitalizeFirstLetter(category)}` 
  })
  return;
}

export const InternalServerError = (
  method: "get" | "post" | "put" | "delete" | "destroy" | "sign-in" | "sign-out", 
  category: string, 
  res: any
) => {
  res.status(500).json({ 
    message: `Failed to ${capitalizeFirstLetter(method)} ${capitalizeFirstLetter(category)}` 
  })
  return;
}