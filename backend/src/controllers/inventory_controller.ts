import { getDB } from '../db/database.ts'
import db from '../db/database'
import { ValidationError, NotFoundError } from '../lib/errors'

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

type SQLValue = string | number | boolean | null | Uint8Array

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
					get: `/api/v1/inventory/data/${table.name}`,
					create: `/api/v1/inventory/data/${table.name}`,
					update: `/api/v1/inventory/data/${table.name}`,
					delete: `/api/v1/inventory/data/${table.name}`
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

/**
 * Get data from any table with pagination, filtering, and pausing support
 */
export const getTableData = ({
	params,
	query
}: {
	params: { table_name: string }
	query: { page?: string; limit?: string; filters?: string; pause?: string }
}) => {
	try {
		const db = getDB()
		const page = parseInt(query.page || '1')
		const limit = parseInt(query.limit || '100')
		const offset = (page - 1) * limit
		const pause = query.pause === 'true'

		// Parse filters if provided
		let filters = {}
		if (query.filters) {
			try {
				filters = JSON.parse(query.filters)
			} catch (error) {
				throw new ValidationError('Invalid filters format', { filters: query.filters })
			}
		}

		// Validate that the table exists
		const tableExists = db
			.query('SELECT name FROM sqlite_master WHERE type="table" AND name = ?')
			.get(params.table_name) as { name: string } | undefined

		if (!tableExists) {
			throw new NotFoundError(`Table ${params.table_name} does not exist`)
		}

		// Build the query with filters
		let queryStr = `SELECT * FROM ${params.table_name}`
		const queryParams: SQLValue[] = []

		if (Object.keys(filters).length > 0) {
			const conditions = Object.entries(filters)
				.map(([key, _], index) => `${key} = ?`)
				.join(' AND ')

			queryStr += ` WHERE ${conditions}`
			queryParams.push(...Object.values(filters).map(value => value as SQLValue))
		}

		// Add ordering, typically by created_at if it exists
		queryStr += ` ORDER BY created_at DESC`

		// Add pagination
		queryStr += ` LIMIT ? OFFSET ?`
		queryParams.push(limit, offset)

		// Get total count (without pagination)
		let countQuery = `SELECT COUNT(*) as count FROM ${params.table_name}`
		const countParams: SQLValue[] = []

		if (Object.keys(filters).length > 0) {
			const conditions = Object.entries(filters)
				.map(([key, _], index) => `${key} = ?`)
				.join(' AND ')

			countQuery += ` WHERE ${conditions}`
			countParams.push(...Object.values(filters).map(value => value as SQLValue))
		}

		const countResult = db.query(countQuery).get(...countParams) as { count: number }
		const total = countResult?.count || 0

		// Execute the main query
		const records = db.query(queryStr).all(...queryParams)

		return {
			success: true,
			data: records,
			total,
			page,
			limit,
			filters,
			pause
		}
	} catch (error) {
		console.error(`Error fetching data from table ${params.table_name}:`, error)
		throw error
	}
}

/**
 * Create a new row in the specified table
 */
export const createTableRow = ({
	params,
	body
}: {
	params: { table_name: string }
	body: { id?: string; data: Record<string, unknown> }
}) => {
	try {
		const db = getDB()

		// Validate that the table exists
		const tableExists = db
			.query('SELECT name FROM sqlite_master WHERE type="table" AND name = ?')
			.get(params.table_name) as { name: string } | undefined

		if (!tableExists) {
			throw new NotFoundError(`Table ${params.table_name} does not exist`)
		}

		// Extract data from the request body
		const { id, data } = body

		// Combine id and data if id is provided
		const rowData = id ? { id, ...data } : data

		// Get table columns
		const columns = db.query(`PRAGMA table_info(${params.table_name})`).all() as { name: string }[]

		// Filter to only include columns that exist in the table
		const validColumns = Object.keys(rowData).filter(key => columns.some(col => col.name === key))

		if (validColumns.length === 0) {
			throw new ValidationError('No valid columns provided', { body })
		}

		// Prepare the query
		const values = validColumns.map(name => rowData[name]) as SQLValue[]
		const placeholders = validColumns.map(() => '?').join(', ')
		const query = `
			INSERT INTO ${params.table_name} (${validColumns.join(', ')})
			VALUES (${placeholders})
		`

		// Execute the query
		const result = db.query(query).run(...values)

		// Return the created record with its ID
		const insertedId = id || result.lastInsertRowid?.toString()

		return {
			success: true,
			data: { id: insertedId, ...data }
		}
	} catch (error) {
		console.error(`Error creating row in table ${params.table_name}:`, error)
		throw error
	}
}

/**
 * Update an existing row in the specified table
 */
export const updateTableRow = ({
	params,
	body
}: {
	params: { table_name: string }
	body: { id: string; data: Record<string, unknown> }
}) => {
	try {
		const db = getDB()

		// Validate that the table exists
		const tableExists = db
			.query('SELECT name FROM sqlite_master WHERE type="table" AND name = ?')
			.get(params.table_name) as { name: string } | undefined

		if (!tableExists) {
			throw new NotFoundError(`Table ${params.table_name} does not exist`)
		}

		// Extract data from the request body
		const { id, data } = body

		if (!id) {
			throw new ValidationError('ID is required for update', { body })
		}

		// Get the columns that are being updated
		const columnsToUpdate = Object.keys(data)

		if (columnsToUpdate.length === 0) {
			throw new ValidationError('No columns to update', { body })
		}

		// Validate that the record exists
		const recordExists = db.query(`SELECT id FROM ${params.table_name} WHERE id = ?`).get(id)
		if (!recordExists) {
			throw new NotFoundError(`Record with id ${id} not found in table ${params.table_name}`)
		}

		// Prepare the query
		const updates = columnsToUpdate.map(name => `${name} = ?`).join(', ')
		const values = [
			...columnsToUpdate.map(name => {
				const value = data[name]
				// Convert empty strings to null for the database
				return value === '' ? null : value
			}),
			id
		] as SQLValue[]

		const query = `
			UPDATE ${params.table_name}
			SET ${updates}
			WHERE id = ?
		`

		// Execute the query
		db.query(query).run(...values)

		// Get the updated record
		const updatedRecord = db.query(`SELECT * FROM ${params.table_name} WHERE id = ?`).get(id)

		return {
			success: true,
			data: updatedRecord
		}
	} catch (error) {
		console.error(`Error updating row in table ${params.table_name}:`, error)
		throw error
	}
}

/**
 * Delete a row from the specified table
 */
export const deleteTableRow = ({ params, body }: { params: { table_name: string }; body: { id: string } }) => {
	try {
		const db = getDB()

		// Validate that the table exists
		const tableExists = db
			.query('SELECT name FROM sqlite_master WHERE type="table" AND name = ?')
			.get(params.table_name) as { name: string } | undefined

		if (!tableExists) {
			throw new NotFoundError(`Table ${params.table_name} does not exist`)
		}

		// Extract ID from the request body
		const { id } = body

		if (!id) {
			throw new ValidationError('ID is required for deletion', { body })
		}

		// Validate that the record exists
		const recordExists = db.query(`SELECT id FROM ${params.table_name} WHERE id = ?`).get(id)
		if (!recordExists) {
			throw new NotFoundError(`Record with id ${id} not found in table ${params.table_name}`)
		}

		// Execute the query
		db.query(`DELETE FROM ${params.table_name} WHERE id = ?`).run(id)

		return {
			success: true,
			message: 'Record deleted successfully'
		}
	} catch (error) {
		console.error(`Error deleting row from table ${params.table_name}:`, error)
		throw error
	}
}
