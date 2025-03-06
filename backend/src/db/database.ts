import { Database } from 'bun:sqlite'
import config from '../config'

// Initialize the database
const db = new Database(config.dbPath, { create: true })

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON')

// Initialize database schema
export function initDatabase() {
	try {
		// Drop and recreate qm_purpose table
		db.run('DROP TABLE IF EXISTS qm_purpose')
		db.run(`
			CREATE TABLE IF NOT EXISTS qm_purpose (
				id TEXT PRIMARY KEY,
				text TEXT NOT NULL,
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
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
		// Check if qm_purpose table is empty
		const result = db.prepare('SELECT COUNT(*) as count FROM qm_purpose').get() as { count: number }
		const qmPurposeCount = result?.count || 0

		if (qmPurposeCount === 0 || force) {
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

			return { success: true, message: 'Database seeded successfully', count: seedData.length }
		}
		return { success: true, message: 'Database already contains data', count: qmPurposeCount }
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
