import SQLiteStore from '../db/SQLiteStore'
import { Options } from 'express-rate-limit'

export const limiterOptions: Options = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5, // Limit each IP to 100 requests per 'window',
  standardHeaders: 'draft-7', // Combined rate limit header- containing / remaining limits & RateLimit-Policy header according to IETF 7th draft,
  legacyHeaders: false, // Disable the X-RateLimit headers
  message: "Exceed limits of 100",
  store: new SQLiteStore(),
  statusCode: 0,
  requestPropertyName: '',
  skipFailedRequests: false,
  skipSuccessfulRequests: false,
  keyGenerator: (): string | Promise<string> => {
    console.warn('Function not implemented.')
    return ''
  },
  handler: () => {
    console.warn('Function not implemented.')
  },
  skip: (): boolean | Promise<boolean> => {
    console.warn('Function not implemented.')
    return false
  },
  requestWasSuccessful: (): boolean | Promise<boolean> => {
    console.warn('Function not implemented')
    return true
  },
  validate: false
}