import SQLiteStore from '../db/SQLiteStore'
import { Options } from 'express-rate-limit'

export const limiterOptions: Options = {
  windowMs: Number(process.env.LIMITER_WINDOW), // 15 minutes
  limit: Number(process.env.LIMITER_LIMIT), // Limit each IP to 5 requests per 'window',
  standardHeaders: 'draft-7', // Combined rate limit header- containing / remaining limits & RateLimit-Policy header according to IETF 7th draft,
  legacyHeaders: false, // Disable the X-RateLimit headers
  message: "Exceed limits of 5 requests per 15 minutes",
  store: new SQLiteStore(),
  statusCode: 0,
  requestPropertyName: '',
  skipFailedRequests: false,
  skipSuccessfulRequests: false,
  keyGenerator: (): string | Promise<string> => {
    // Consider: implement limit by req.ip
    console.warn('Function not implemented.')
    return ''
  },
  handler: () => {
    // Consider: implement custom response for when client exceeds the rate limit
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
  validate: false, // Consider: implement custom error-handling logic
  passOnStoreError: false, // Consider: implement customer error-handling logic
  identifier: ''
}