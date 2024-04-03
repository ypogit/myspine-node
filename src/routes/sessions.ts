import { Router } from 'express'
import { sessions } from '../controllers'

const router = Router()

router.post('/login', sessions.login)
router.post('/logout', sessions.logout)

export { router as sessionsRouter }