import { getDB } from '../db/database'
import db from '../db/database'
import { ValidationError, NotFoundError } from '../lib/errors'

type SQLValue = string | number | boolean | null | Uint8Array

/**
 * Get records from any table with pagination
 */
export const getTableRecords = ({
	params,
	query
}: {
	params: { table: string }
	query: { page?: string; limit?: string }
}) => {
	try {
		const db = getDB()
		const page = parseInt(query.page || '1')
		const limit = parseInt(query.limit || '100')
		const offset = (page - 1) * limit

		// Validate that the table exists
		const tableExists = db.query('SELECT name FROM sqlite_master WHERE type="table" AND name = ?').get(params.table) as
			| { name: string }
			| undefined

		if (!tableExists) {
			throw new NotFoundError(`Table ${params.table} does not exist`)
		}

		// Get total count
		const countResult = db.query(`SELECT COUNT(*) as count FROM ${params.table}`).get() as { count: number }
		const total = countResult?.count || 0

		// Get paginated records
		const records = db
			.query(
				`
			SELECT * FROM ${params.table}
			ORDER BY created_at DESC
			LIMIT ${limit} OFFSET ${offset}
		`
			)
			.all()

		return {
			success: true,
			data: records,
			total,
			page,
			limit
		}
	} catch (error) {
		console.error(`Error fetching records from table ${params.table}:`, error)
		throw error
	}
}

/**
 * Create a new record in any table
 */
export const createTableRecord = ({ params, body }: { params: { table: string }; body: Record<string, unknown> }) => {
	try {
		const db = getDB()

		// Validate that the table exists
		const tableExists = db.query('SELECT name FROM sqlite_master WHERE type="table" AND name = ?').get(params.table) as
			| { name: string }
			| undefined

		if (!tableExists) {
			throw new NotFoundError(`Table ${params.table} does not exist`)
		}

		// Get table columns
		const columns = db.query(`PRAGMA table_info(${params.table})`).all() as { name: string }[]
		const columnNames = columns.map(col => col.name).filter(name => name !== 'id')

		// Prepare the query
		const values = columnNames.map(name => body[name]) as SQLValue[]
		const placeholders = columnNames.map(() => '?').join(', ')
		const query = `
			INSERT INTO ${params.table} (${columnNames.join(', ')})
			VALUES (${placeholders})
		`

		// Execute the query
		const result = db.query(query).run(...values)

		return {
			success: true,
			data: { id: result.lastInsertRowid, ...body }
		}
	} catch (error) {
		console.error(`Error creating record in table ${params.table}:`, error)
		throw error
	}
}

/**
 * Update a record in any table
 */
export const updateTableRecord = ({
	params,
	body
}: {
	params: { table: string; id: string }
	body: Record<string, unknown>
}) => {
	try {
		const db = getDB()

		// Validate that the table exists
		const tableExists = db.query('SELECT name FROM sqlite_master WHERE type="table" AND name = ?').get(params.table) as
			| { name: string }
			| undefined

		if (!tableExists) {
			throw new NotFoundError(`Table ${params.table} does not exist`)
		}

		// Get the columns that are being updated (filter out undefined values)
		const columnsToUpdate = Object.entries(body)
			.filter(([_, value]) => value !== undefined)
			.map(([key]) => key)

		if (columnsToUpdate.length === 0) {
			throw new ValidationError('No columns to update', { body })
		}

		// Validate that the record exists
		const recordExists = db.query(`SELECT id FROM ${params.table} WHERE id = ?`).get(params.id)
		if (!recordExists) {
			throw new NotFoundError(`Record with id ${params.id} not found in table ${params.table}`)
		}

		// Prepare the query
		const updates = columnsToUpdate.map(name => `${name} = ?`).join(', ')
		const values = [
			...columnsToUpdate.map(name => {
				const value = body[name]
				// Convert empty strings to null for the database
				return value === '' ? null : value
			}),
			params.id
		] as SQLValue[]

		const query = `
			UPDATE ${params.table}
			SET ${updates}
			WHERE id = ?
		`

		// Execute the query
		db.query(query).run(...values)

		// Get the updated record
		const updatedRecord = db.query(`SELECT * FROM ${params.table} WHERE id = ?`).get(params.id)

		return {
			success: true,
			data: updatedRecord
		}
	} catch (error) {
		console.error(`Error updating record in table ${params.table}:`, error)
		throw error
	}
}

/**
 * Delete a record from any table
 */
export const deleteTableRecord = ({ params }: { params: { table: string; id: string } }) => {
	try {
		const db = getDB()

		// Validate that the table exists
		const tableExists = db.query('SELECT name FROM sqlite_master WHERE type="table" AND name = ?').get(params.table) as
			| { name: string }
			| undefined

		if (!tableExists) {
			throw new NotFoundError(`Table ${params.table} does not exist`)
		}

		// Validate that the record exists
		const recordExists = db.query(`SELECT id FROM ${params.table} WHERE id = ?`).get(params.id)
		if (!recordExists) {
			throw new NotFoundError(`Record with id ${params.id} not found in table ${params.table}`)
		}

		// Execute the query
		db.query(`DELETE FROM ${params.table} WHERE id = ?`).run(params.id)

		return {
			success: true,
			message: 'Record deleted successfully'
		}
	} catch (error) {
		console.error(`Error deleting record from table ${params.table}:`, error)
		throw error
	}
}
