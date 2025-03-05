import { DB } from '../../deps.ts'
import config from '../config.ts'

// Create a singleton database instance
let db: DB | null = null

// Get database connection
export function getDB(): DB {
	if (!db) {
		db = new DB(config.dbPath)
		initDatabase()
	}
	return db
}

// Initialize database schema
function initDatabase() {
	const db = getDB()

	// Create products table
	db.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      quantity INTEGER NOT NULL,
      min_quantity INTEGER DEFAULT ${config.defaultMinQuantity},
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

	console.log('Database initialized')
}

// Close database connection (useful for tests and clean shutdown)
export function closeDB() {
	if (db) {
		db.close()
		db = null
	}
}
