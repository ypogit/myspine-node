import crypto from 'crypto'

const SESSION_SECRET = crypto.randomBytes(128).toString('hex')

// At the time of this annotation, many default values for express-session have been deprecated
export const sessionOptions = {
  secret: SESSION_SECRET,
  cookie: {
    secure: true, // Using HTTPS
    maxAge: Number(process.env.SESSION_COOKIE_MAX_AGE) 
      || 24 * 60 * 60 * 1000  // Expires in 1 day
  },
  saveUninitialized: false, //  No cookies on a response with an uninitialized session
  resave: false // Force save the unmodified session to the session store
}