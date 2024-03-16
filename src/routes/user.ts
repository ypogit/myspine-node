import rateLimit from 'express-rate-limit'
import { limiterOptions } from 'src/middleware'
import { router } from '../server'
import { users } from '../controllers'

router.get('/users', users.getUsers)
router.get('/user/:id', users.getUserById)
router.post('/user/create', users.postUser)
router.put('/user/:id/update', users.postUser)
router.delete('/user/:id/delete', users.deleteUser)
router.get(
  '/signIn', 
  rateLimit(limiterOptions), 
  users.signIn
)
router.post('/signOut', users.signOut)