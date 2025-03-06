import { Elysia } from 'elysia'
import db, { seedDatabase, resetAndSeedDatabase } from '../db/database'

const app = new Elysia({ prefix: '/seed' })
	.get('/', () => {
		return seedDatabase()
	})
	.get('/reset', () => {
		// drop the database
		// FIXME: create its own function
		db.run('DROP TABLE IF EXISTS qm_purpose')
		return resetAndSeedDatabase()
	})

export default app
