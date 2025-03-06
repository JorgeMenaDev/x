import { getDB } from '../db/database.ts'
import db from '../db/database'

interface TableInfo {
	name: string
}

// Get low inventory products
export const getLowInventory = () => {
	// TODO: Implement low inventory check
	return {
		success: true,
		data: []
	}
}

// Get all tables
export const getTables = () => {
	try {
		// Get all table names from the SQLite master table
		const tables = db
			.query('SELECT name FROM sqlite_master WHERE type="table" AND name NOT LIKE "sqlite_%"')
			.all() as TableInfo[]

		// Format the response
		return {
			success: true,
			tables: tables.map(table => ({
				name: table.name,
				schema: 'public'
			}))
		}
	} catch (error) {
		console.error('Error fetching tables:', error)
		throw new Error('Failed to fetch tables')
	}
}
