import { dropboxRouter } from './dropbox'
import { sessionsRouter } from './sessions'
import { usersRouter } from './users'
import { customersRouter } from './customers'

const routes = [
  { path: '/', router: sessionsRouter },
  { path: '/', router: dropboxRouter },
  { path: '/users', router: usersRouter },
  { path: '/customers', router: customersRouter }
]

export default routes