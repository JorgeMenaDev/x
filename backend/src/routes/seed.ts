import { Elysia } from 'elysia'
import { seedDatabase, resetAndSeedDatabase } from '../db/database'

const app = new Elysia({ prefix: '/seed' })
	.get('/', () => {
		return seedDatabase()
	})
	.get('/reset', () => {
		return resetAndSeedDatabase()
	})

export default app
