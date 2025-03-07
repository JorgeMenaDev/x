import { Database } from 'bun:sqlite'
import config from '../config'

// Initialize the database
const db = new Database(config.dbPath, { create: true })

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON')

// Initialize database schema
export function initDatabase() {
	try {
		// Create qm_purpose table if it doesn't exist
		db.run(`
			CREATE TABLE IF NOT EXISTS qm_purpose (
				id TEXT PRIMARY KEY,
				text TEXT NOT NULL,
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
			)
		`)

		// Create qm_model_type table
		db.run(`
			CREATE TABLE IF NOT EXISTS qm_model_type (
				qm_type_id INTEGER PRIMARY KEY,
				qm_type TEXT NOT NULL,
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
			)
		`)

		// Create qm_model_purpose table
		db.run(`
			CREATE TABLE IF NOT EXISTS qm_model_purpose (
				purpose_id INTEGER PRIMARY KEY,
				purpose TEXT NOT NULL,
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
			)
		`)

		// Create qm_uses table
		db.run(`
			CREATE TABLE IF NOT EXISTS qm_uses (
				use_id INTEGER PRIMARY KEY,
				use TEXT NOT NULL,
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
			)
		`)

		// Create qm_asset_class table
		db.run(`
			CREATE TABLE IF NOT EXISTS qm_asset_class (
				assetclass_id INTEGER PRIMARY KEY,
				assetclass TEXT NOT NULL,
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
			)
		`)

		// Create qm_subgroup table
		db.run(`
			CREATE TABLE IF NOT EXISTS qm_subgroup (
				subgroup_id INTEGER PRIMARY KEY,
				subgroup TEXT NOT NULL,
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
			)
		`)

		// Create relationship tables for level2 data

		// Purpose to Use relationship table
		db.run(`
			CREATE TABLE IF NOT EXISTS qm_purpose_to_use (
				id TEXT PRIMARY KEY,
				purpose_id INTEGER NOT NULL,
				use_id INTEGER NOT NULL,
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				FOREIGN KEY (purpose_id) REFERENCES qm_model_purpose (purpose_id),
				FOREIGN KEY (use_id) REFERENCES qm_uses (use_id),
				UNIQUE (purpose_id, use_id)
			)
		`)

		// Subgroup to Use relationship table
		db.run(`
			CREATE TABLE IF NOT EXISTS qm_subgroup_to_use (
				id TEXT PRIMARY KEY,
				subgroup_id INTEGER NOT NULL,
				use_id INTEGER NOT NULL,
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				FOREIGN KEY (subgroup_id) REFERENCES qm_subgroup (subgroup_id),
				FOREIGN KEY (use_id) REFERENCES qm_uses (use_id),
				UNIQUE (subgroup_id, use_id)
			)
		`)

		// Purpose to AssetClass relationship table
		db.run(`
			CREATE TABLE IF NOT EXISTS qm_purpose_to_asset_class (
				id TEXT PRIMARY KEY,
				purpose_id INTEGER NOT NULL,
				assetclass_id INTEGER NOT NULL,
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				FOREIGN KEY (purpose_id) REFERENCES qm_model_purpose (purpose_id),
				FOREIGN KEY (assetclass_id) REFERENCES qm_asset_class (assetclass_id),
				UNIQUE (purpose_id, assetclass_id)
			)
		`)

		console.log('Database schema initialized')
	} catch (error) {
		console.error('Error initializing database schema:', error)
		throw error
	}
}

// Reset and seed the database
export function resetAndSeedDatabase() {
	try {
		// First reinitialize the database schema
		initDatabase()
		return seedDatabase(true)
	} catch (error) {
		console.error('Error resetting database:', error)
		throw error
	}
}

// Seed the database with initial data
export function seedDatabase(force = false) {
	try {
		// Import reference data
		const modelReferenceData = require('../../data/modelReferenceData.json')

		// Clear existing data if force is true
		if (force) {
			// Clear relationship tables first (to avoid foreign key constraints)
			db.run('DELETE FROM qm_purpose_to_use')
			db.run('DELETE FROM qm_subgroup_to_use')
			db.run('DELETE FROM qm_purpose_to_asset_class')

			// Then clear main tables
			db.run('DELETE FROM qm_model_type')
			db.run('DELETE FROM qm_model_purpose')
			db.run('DELETE FROM qm_uses')
			db.run('DELETE FROM qm_asset_class')
			db.run('DELETE FROM qm_subgroup')
			db.run('DELETE FROM qm_purpose')
		}

		// Check if tables are empty
		const qmPurposeCount = db.prepare('SELECT COUNT(*) as count FROM qm_purpose').get() as { count: number }
		const qmModelTypeCount = db.prepare('SELECT COUNT(*) as count FROM qm_model_type').get() as { count: number }
		const qmModelPurposeCount = db.prepare('SELECT COUNT(*) as count FROM qm_model_purpose').get() as { count: number }
		const qmUsesCount = db.prepare('SELECT COUNT(*) as count FROM qm_uses').get() as { count: number }
		const qmAssetClassCount = db.prepare('SELECT COUNT(*) as count FROM qm_asset_class').get() as { count: number }
		const qmSubgroupCount = db.prepare('SELECT COUNT(*) as count FROM qm_subgroup').get() as { count: number }

		// Seed QModelType data
		if (qmModelTypeCount?.count === 0 || force) {
			const stmt = db.prepare('INSERT OR REPLACE INTO qm_model_type (qm_type_id, qm_type) VALUES (?, ?)')

			for (const item of modelReferenceData.QModelType) {
				stmt.run(item.qm_type_id, item.qm_type)
			}
			console.log('Seeded QModelType data')
		}

		// Seed QModelPurpose data
		if (qmModelPurposeCount?.count === 0 || force) {
			const stmt = db.prepare('INSERT OR REPLACE INTO qm_model_purpose (purpose_id, purpose) VALUES (?, ?)')

			for (const item of modelReferenceData.QModelPurpose) {
				stmt.run(item.purpose_id, item.purpose)
			}
			console.log('Seeded QModelPurpose data')
		}

		// Seed Uses data
		if (qmUsesCount?.count === 0 || force) {
			const stmt = db.prepare('INSERT OR REPLACE INTO qm_uses (use_id, use) VALUES (?, ?)')

			for (const item of modelReferenceData.Uses) {
				stmt.run(item.use_id, item.use)
			}
			console.log('Seeded Uses data')
		}

		// Seed AssetClass data
		if (qmAssetClassCount?.count === 0 || force) {
			const stmt = db.prepare('INSERT OR REPLACE INTO qm_asset_class (assetclass_id, assetclass) VALUES (?, ?)')

			for (const item of modelReferenceData.AssetClass) {
				stmt.run(item.assetclass_id, item.assetclass)
			}
			console.log('Seeded AssetClass data')
		}

		// Seed Subgroup data
		if (qmSubgroupCount?.count === 0 || force) {
			const stmt = db.prepare('INSERT OR REPLACE INTO qm_subgroup (subgroup_id, subgroup) VALUES (?, ?)')

			for (const item of modelReferenceData.Subgroup) {
				stmt.run(item.subgroup_id, item.subgroup)
			}
			console.log('Seeded Subgroup data')
		}

		// Seed qm_purpose data
		if (qmPurposeCount?.count === 0 || force) {
			// Add seed data for qm_purpose
			const now = new Date().toISOString()
			const seedData = [
				{
					id: generateUUID(),
					text: 'Risk Management',
					created_at: now,
					updated_at: now
				},
				{
					id: generateUUID(),
					text: 'Portfolio Optimization',
					created_at: now,
					updated_at: now
				},
				{
					id: generateUUID(),
					text: 'Compliance',
					created_at: now,
					updated_at: now
				},
				{
					id: generateUUID(),
					text: 'Market Analysis',
					created_at: now,
					updated_at: now
				}
			]

			const stmt = db.prepare('INSERT INTO qm_purpose (id, text, created_at, updated_at) VALUES (?, ?, ?, ?)')

			for (const item of seedData) {
				stmt.run(item.id, item.text, item.created_at, item.updated_at)
			}
			console.log('Seeded qm_purpose data')
		}

		// Now seed relationship tables after all main tables are populated
		// Seed PurposeToUse relationships
		if (force) {
			// Verify that the referenced tables have data
			const purposeCount = db.prepare('SELECT COUNT(*) as count FROM qm_model_purpose').get() as { count: number }
			const usesCount = db.prepare('SELECT COUNT(*) as count FROM qm_uses').get() as { count: number }
			const assetClassCount = db.prepare('SELECT COUNT(*) as count FROM qm_asset_class').get() as { count: number }
			const subgroupCount = db.prepare('SELECT COUNT(*) as count FROM qm_subgroup').get() as { count: number }

			if (purposeCount?.count > 0 && usesCount?.count > 0) {
				// Seed PurposeToUse relationships
				const purposeToUseStmt = db.prepare('INSERT INTO qm_purpose_to_use (id, purpose_id, use_id) VALUES (?, ?, ?)')

				// Track inserted combinations to avoid duplicates
				const insertedCombinations = new Set<string>()

				for (const item of modelReferenceData.model_reference_data_level2.PurposeToUse) {
					// Check if the referenced IDs exist
					const purposeExists = db
						.prepare('SELECT COUNT(*) as count FROM qm_model_purpose WHERE purpose_id = ?')
						.get(item.purpose_id) as { count: number }
					const useExists = db.prepare('SELECT COUNT(*) as count FROM qm_uses WHERE use_id = ?').get(item.use_id) as {
						count: number
					}

					// Create a unique key for this combination
					const combinationKey = `${item.purpose_id}-${item.use_id}`

					// Only insert if IDs exist and combination hasn't been inserted yet
					if (purposeExists?.count > 0 && useExists?.count > 0 && !insertedCombinations.has(combinationKey)) {
						purposeToUseStmt.run(generateUUID(), item.purpose_id, item.use_id)
						insertedCombinations.add(combinationKey)
					} else if (!purposeExists?.count || !useExists?.count) {
						console.warn(
							`Skipping PurposeToUse relationship: purpose_id=${item.purpose_id}, use_id=${item.use_id} - one or both IDs don't exist`
						)
					} else {
						console.warn(
							`Skipping duplicate PurposeToUse relationship: purpose_id=${item.purpose_id}, use_id=${item.use_id}`
						)
					}
				}
				console.log('Seeded PurposeToUse relationships')
			}

			if (subgroupCount?.count > 0 && usesCount?.count > 0) {
				// Seed SubgroupToUse relationships
				const subgroupToUseStmt = db.prepare(
					'INSERT INTO qm_subgroup_to_use (id, subgroup_id, use_id) VALUES (?, ?, ?)'
				)

				// Track inserted combinations to avoid duplicates
				const insertedCombinations = new Set<string>()

				for (const item of modelReferenceData.model_reference_data_level2.SubgroupToUse) {
					// Check if the referenced IDs exist
					const subgroupExists = db
						.prepare('SELECT COUNT(*) as count FROM qm_subgroup WHERE subgroup_id = ?')
						.get(item.subgroup_id) as { count: number }
					const useExists = db.prepare('SELECT COUNT(*) as count FROM qm_uses WHERE use_id = ?').get(item.use_id) as {
						count: number
					}

					// Create a unique key for this combination
					const combinationKey = `${item.subgroup_id}-${item.use_id}`

					// Only insert if IDs exist and combination hasn't been inserted yet
					if (subgroupExists?.count > 0 && useExists?.count > 0 && !insertedCombinations.has(combinationKey)) {
						subgroupToUseStmt.run(generateUUID(), item.subgroup_id, item.use_id)
						insertedCombinations.add(combinationKey)
					} else if (!subgroupExists?.count || !useExists?.count) {
						console.warn(
							`Skipping SubgroupToUse relationship: subgroup_id=${item.subgroup_id}, use_id=${item.use_id} - one or both IDs don't exist`
						)
					} else {
						console.warn(
							`Skipping duplicate SubgroupToUse relationship: subgroup_id=${item.subgroup_id}, use_id=${item.use_id}`
						)
					}
				}
				console.log('Seeded SubgroupToUse relationships')
			}

			if (purposeCount?.count > 0 && assetClassCount?.count > 0) {
				// Seed PurposeToAssetClass relationships
				const purposeToAssetClassStmt = db.prepare(
					'INSERT INTO qm_purpose_to_asset_class (id, purpose_id, assetclass_id) VALUES (?, ?, ?)'
				)

				// Track inserted combinations to avoid duplicates
				const insertedCombinations = new Set<string>()

				for (const item of modelReferenceData.model_reference_data_level2.PurposeToAssetClass) {
					// Check if the referenced IDs exist
					const purposeExists = db
						.prepare('SELECT COUNT(*) as count FROM qm_model_purpose WHERE purpose_id = ?')
						.get(item.purpose_id) as { count: number }
					const assetClassExists = db
						.prepare('SELECT COUNT(*) as count FROM qm_asset_class WHERE assetclass_id = ?')
						.get(item.assetclass_id) as { count: number }

					// Create a unique key for this combination
					const combinationKey = `${item.purpose_id}-${item.assetclass_id}`

					// Only insert if IDs exist and combination hasn't been inserted yet
					if (purposeExists?.count > 0 && assetClassExists?.count > 0 && !insertedCombinations.has(combinationKey)) {
						purposeToAssetClassStmt.run(generateUUID(), item.purpose_id, item.assetclass_id)
						insertedCombinations.add(combinationKey)
					} else if (!purposeExists?.count || !assetClassExists?.count) {
						console.warn(
							`Skipping PurposeToAssetClass relationship: purpose_id=${item.purpose_id}, assetclass_id=${item.assetclass_id} - one or both IDs don't exist`
						)
					} else {
						console.warn(
							`Skipping duplicate PurposeToAssetClass relationship: purpose_id=${item.purpose_id}, assetclass_id=${item.assetclass_id}`
						)
					}
				}
				console.log('Seeded PurposeToAssetClass relationships')
			}
		}

		return {
			success: true,
			message: 'Database seeded successfully',
			counts: {
				qm_purpose: qmPurposeCount?.count || 0,
				qm_model_type: qmModelTypeCount?.count || 0,
				qm_model_purpose: qmModelPurposeCount?.count || 0,
				qm_uses: qmUsesCount?.count || 0,
				qm_asset_class: qmAssetClassCount?.count || 0,
				qm_subgroup: qmSubgroupCount?.count || 0
			}
		}
	} catch (error) {
		console.error('Error seeding database:', error)
		throw error
	}
}

export default db

// Get database connection
export function getDB(): Database {
	return db
}

// Close database connection (useful for tests and clean shutdown)
export function closeDB() {
	if (db) {
		db.close()
	}
}

// Generate a UUID
export function generateUUID(): string {
	return crypto.randomUUID()
}
