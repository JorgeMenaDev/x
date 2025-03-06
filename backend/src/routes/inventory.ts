import { Elysia, t } from 'elysia'
import { getLowInventory, getTables } from '../controllers/inventory_controller'

const app = new Elysia({ prefix: '/v1/inventory' })

// Inventory endpoints
app.get('/low', getLowInventory)

// Tables endpoints
app.get('/tables', getTables)

export default app
