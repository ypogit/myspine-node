import { Router } from 'express'
import { users } from '../controllers'

const router = Router()

router.get('/', users.getUsers)
router.get('/:id', users.getUserById)
router.post('/create', users.postUser)
router.put('/:id/update', users.putUser)
router.delete('/:id/delete', users.deleteUser)

export { router as usersRouter }