import { Router } from '../../deps.ts'
import { getLowInventory } from '../controllers/inventory_controller.ts'

const router = new Router()

router.get('/api/inventory/low', getLowInventory)

export default router
