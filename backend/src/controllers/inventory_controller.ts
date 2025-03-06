import { getDB } from '../db/database.ts'
import db from '../db/database'

interface TableInfo {
	name: string
	schema: string
	columns: ColumnInfo[]
	endpoints: TableEndpoints
}

interface ColumnInfo {
	name: string
	type: string
	nullable: boolean
	isPrimary: boolean
}

interface TableEndpoints {
	get: string
	create: string
	update: string
	delete: string
}

interface PragmaResult {
	name: string
	type: string
	notnull: number
	pk: number
}

// Get low inventory products
export const getLowInventory = () => {
	// TODO: Implement low inventory check
	return {
		success: true,
		data: []
	}
}

// Get all tables with their metadata
export const getTables = () => {
	try {
		// Get all table names from the SQLite master table
		const tables = db.query('SELECT name FROM sqlite_master WHERE type="table" AND name NOT LIKE "sqlite_%"').all() as {
			name: string
		}[]

		// Get column information for each table
		const tablesWithMetadata = tables.map(table => {
			const columns = db.query(`PRAGMA table_info(${table.name})`).all() as PragmaResult[]

			return {
				name: table.name,
				schema: 'public',
				columns: columns.map(col => ({
					name: col.name,
					type: col.type.toLowerCase(),
					nullable: !col.notnull,
					isPrimary: !!col.pk
				})),
				endpoints: {
					get: `/api/v1/tables/${table.name}`,
					create: `/api/v1/tables/${table.name}`,
					update: `/api/v1/tables/${table.name}/:id`,
					delete: `/api/v1/tables/${table.name}/:id`
				}
			}
		})

		return {
			success: true,
			tables: tablesWithMetadata
		}
	} catch (error) {
		console.error('Error fetching tables:', error)
		throw new Error('Failed to fetch tables')
	}
}
