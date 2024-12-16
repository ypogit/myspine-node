import { Router } from 'express'
import { dropbox } from '../controllers'

const router = Router()

router.get('/auth/dropbox', dropbox.authDropbox)
router.get('/auth/dropbox/callback', dropbox.authDropboxCallback)

export { router as dropboxRouter }