import { dropboxRouter } from './dropbox'
import { sessionsRouter } from './sessions'
import { usersRouter } from './users'
import { patientsRouter } from './patients'

const routes = [
  { path: '/', router: sessionsRouter },
  { path: '/', router: dropboxRouter },
  { path: '/users', router: usersRouter },
  { path: '/patients', router: patientsRouter }
]

export default routes