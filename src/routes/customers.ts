import { Router } from "express"
import { customers } from '../controllers'

const router = Router()

router.get('/', customers.getCustomers)
router.get('/:id', customers.getCustomerById)
router.post('/create', customers.postCustomer)
router.delete('/:id/delete', customers.deleteCustomer)

export { router as customersRouter }