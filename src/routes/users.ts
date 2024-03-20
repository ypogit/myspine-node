import { Router } from 'express'
import { limiterOptions } from '../middleware'
import { users } from '../controllers'
import rateLimit from 'express-rate-limit'

const router = Router()

router.get('/', users.getUsers)
router.get('/:id', users.getUserById)
router.post('/create', users.postUser)
router.put('/:id/update', users.postUser)
router.delete('/:id/delete', users.deleteUser)
router.get(
  '/signIn', 
  rateLimit(limiterOptions), 
  users.signIn
)
router.post('/signOut', users.signOut)

export { router as usersRouter }