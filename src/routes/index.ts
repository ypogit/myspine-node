import { sessionsRouter } from './sessions'
import { usersRouter } from './users'

const routes = [
  { path: '/', router: sessionsRouter },
  { path: '/users', router: usersRouter }
]

export default routes