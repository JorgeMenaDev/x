import { Elysia } from 'elysia'
import inventoryRoutes from './routes/inventory'
import qmPurposeRoutes from './domains/qm/routes/purpose.routes'

const app = new Elysia().use(inventoryRoutes).use(qmPurposeRoutes)

export default app
