import { Elysia } from 'elysia'
import db, { seedDatabase, resetAndSeedDatabase } from '../db/database'

const app = new Elysia({ prefix: '/seed' })
	.get('/', () => {
		return seedDatabase()
	})
	.get('/reset', () => {
		// Drop all tables in the correct order (to avoid foreign key constraints)
		// First drop relationship tables
		db.run('DROP TABLE IF EXISTS qm_purpose_to_use')
		db.run('DROP TABLE IF EXISTS qm_subgroup_to_use')
		db.run('DROP TABLE IF EXISTS qm_purpose_to_asset_class')

		// Then drop main tables
		db.run('DROP TABLE IF EXISTS qm_purpose')
		db.run('DROP TABLE IF EXISTS qm_model_type')
		db.run('DROP TABLE IF EXISTS qm_model_purpose')
		db.run('DROP TABLE IF EXISTS qm_uses')
		db.run('DROP TABLE IF EXISTS qm_asset_class')
		db.run('DROP TABLE IF EXISTS qm_subgroup')

		return resetAndSeedDatabase()
	})

export default app
