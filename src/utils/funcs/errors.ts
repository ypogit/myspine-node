import { capitalizeFirstLetter } from './strings'

interface CreateErrorOptions {
  res: any
  statusCode: number
  message: string
  error?: Error | unknown
}

// const createError = ({ res, statusCode, message, error }: CreateErrorOptions) => {
//   if (!res.headersSent) {
//     res.status(statusCode).json({ message })
//     console.trace(error ? error : message )
//     throw new Error(message)
//   }
// }

function createError({ res, statusCode, message, error }: CreateErrorOptions) {
  if (!error) {
    error = new Error(message);
  }

  if (!res.headersSent) {
    res.status(statusCode).json({ message });
    if (process.env.NODE_ENV === 'test') {
      // Don't log the error if we're in a test environment
      return;
    }
    console.trace(error ? error : message);
  }
  throw new Error(message);
}

export const BadRequestError = (category: string, res: any, error?: Error | unknown) => {
 const message = `${capitalizeFirstLetter(category)} Required`
  createError({ res, statusCode: 400, message, error})
}

export const UnauthorizedRequestError = (category: string, res: any, error?: Error | unknown) => {
  const message = `Unauthorized: Invalid ${capitalizeFirstLetter(category)}`
  createError({ res, statusCode: 401, message, error})
}

export const NotFoundError = (category: string, res: any, error?: Error | unknown) => {
  const message = `${capitalizeFirstLetter(category)} Not Found`
  createError({ res, statusCode: 404, message, error})
}

export const ExternalServerError = (category: string, res: any, error?: Error | unknown) => {
  const message = `Server Error: Something went wrong with ${capitalizeFirstLetter(category)}`
  createError({ res, statusCode: 500, message, error})
}

export const InternalServerError = (
  method: "read" | "create" | "update" | "delete" | "destroy" | "login" | "logout" | "auth",
  category: string, 
  res: any,
  error?: Error | unknown
) => {
  const message = `Internal Server Error : Unable to ${capitalizeFirstLetter(method)} ${capitalizeFirstLetter(category)}`
  createError({ res, statusCode: 500, message, error})
}