import { Elysia } from 'elysia'
import inventoryRoutes from './routes/inventory'

const app = new Elysia().use(inventoryRoutes).use(qmPurposeRoutes)

export default app
