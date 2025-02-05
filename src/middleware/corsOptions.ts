import { CorsOptions } from 'cors'

type OriginCallback = (err: Error | null, origin?: boolean) => void

export const corsOptions: CorsOptions = {
  origin: (origin, callback: OriginCallback) => {
    if (origin === process.env.CLIENT_URL) {
      callback(null, true);
    } else if (!origin) {
      console.warn('CORS request without origin detected');
      callback(new Error('CORS request must include an origin header'))
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Cookies, auth headers, TLS client cert will be sent with cross-origin requests. For session-based auth or cookies handling
  optionsSuccessStatus: 200,
}