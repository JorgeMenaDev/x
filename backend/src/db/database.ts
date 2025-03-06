import { Database } from 'bun:sqlite'
import config from '../config'

// Initialize the database
const db = new Database(config.dbPath, { create: true })

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON')

// Initialize database schema
function initDatabase() {
	try {
		// Create qm_purpose table
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

// Seed the database with initial data
function seedDatabase() {
	try {
		// Check if qm_purpose table is empty
		const qmPurposeCount = db.query('SELECT COUNT(*) as count FROM qm_purpose').get()?.count || 0

		if (qmPurposeCount === 0) {
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

			for (const item of seedData) {
				db.query('INSERT INTO qm_purpose (id, text, created_at, updated_at) VALUES (?, ?, ?, ?)', [
					item.id,
					item.text,
					item.created_at,
					item.updated_at
				])
			}

			console.log('Seed data added for qm_purpose table')
		}
	} catch (error) {
		console.error('Error seeding database:', error)
		throw error
	}
}

// Initialize and seed the database
try {
	initDatabase()
	seedDatabase()
	console.log('Database initialized and seeded successfully')
} catch (error) {
	console.error('Failed to initialize database:', error)
	process.exit(1)
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
