import { getDB, generateUUID } from '../db/database.ts'
import { QmPurpose } from '../db/models/qm_purpose.ts'
import db from '../db/database'
import { Elysia } from 'elysia'

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
		const tables = db.query('SELECT name FROM sqlite_master WHERE type="table" AND name NOT LIKE "sqlite_%"').all()

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

// Get records from the qm_purpose table
export const getQmPurposeRecords = ({ query }: { query: { page?: string; limit?: string } }) => {
	try {
		const db = getDB()
		const page = parseInt(query.page || '1')
		const limit = parseInt(query.limit || '100')
		const offset = (page - 1) * limit

		// Get total count
		const countQuery = 'SELECT COUNT(*) as count FROM qm_purpose'
		const countResult = db.query(countQuery).get() as { count: number }
		const total = countResult?.count || 0

		// Get paginated records - Convert numbers to strings for SQLite
		const recordsQuery = `
			SELECT * FROM qm_purpose
			ORDER BY created_at DESC
			LIMIT ${limit} OFFSET ${offset}
		`
		const records = db.query(recordsQuery).all()

		console.log(`Retrieved ${records.length} records`)

		return {
			success: true,
			data: records,
			total,
			page,
			limit
		}
	} catch (error) {
		console.error('Error in getQmPurposeRecords:', {
			error,
			stack: error instanceof Error ? error.stack : undefined,
			message: error instanceof Error ? error.message : 'Unknown error'
		})
		throw new Error('Failed to fetch qm_purpose records')
	}
}

// Create a new record in the qm_purpose table
export const createQmPurposeRecord = ({ body }: { body: { text: string } }) => {
	try {
		if (!body.text) {
			throw new Error('Text is required')
		}

		const db = getDB()
		const id = generateUUID()
		const now = new Date().toISOString()

		const query = `
			INSERT INTO qm_purpose (id, text, created_at, updated_at)
			VALUES (?, ?, ?, ?)
		`
		db.query(query, [id, body.text, now, now])

		const newRecord: QmPurpose = {
			id,
			text: body.text,
			created_at: now,
			updated_at: now
		}

		return {
			success: true,
			data: newRecord
		}
	} catch (error) {
		console.error('Error in createQmPurposeRecord:', {
			error,
			stack: error instanceof Error ? error.stack : undefined,
			message: error instanceof Error ? error.message : 'Unknown error'
		})
		throw error
	}
}

// Update an existing record in the qm_purpose table
export const updateQmPurposeRecord = ({ params, body }: { params: { id: string }; body: { text: string } }) => {
	try {
		if (!body.text) {
			throw new Error('Text is required')
		}

		const db = getDB()
		const id = params.id

		// Check if record exists
		const checkQuery = 'SELECT * FROM qm_purpose WHERE id = ?'
		const existingRecord = db.query(checkQuery, [id]).get() as QmPurpose | undefined

		if (!existingRecord) {
			throw new Error('Record not found')
		}

		const now = new Date().toISOString()

		const query = `
			UPDATE qm_purpose
			SET text = ?, updated_at = ?
			WHERE id = ?
		`
		db.query(query, [body.text, now, id])

		const updatedRecord: QmPurpose = {
			id,
			text: body.text,
			created_at: existingRecord.created_at,
			updated_at: now
		}

		return {
			success: true,
			data: updatedRecord
		}
	} catch (error) {
		console.error('Error in updateQmPurposeRecord:', {
			error,
			stack: error instanceof Error ? error.stack : undefined,
			message: error instanceof Error ? error.message : 'Unknown error'
		})
		throw error
	}
}

// Delete a record from the qm_purpose table
export const deleteQmPurposeRecord = ({ params }: { params: { id: string } }) => {
	try {
		const db = getDB()
		const id = params.id

		// Check if record exists
		const checkQuery = 'SELECT * FROM qm_purpose WHERE id = ?'
		const existingRecord = db.query(checkQuery, [id]).get() as QmPurpose | undefined

		if (!existingRecord) {
			throw new Error('Record not found')
		}

		const query = 'DELETE FROM qm_purpose WHERE id = ?'
		db.query(query, [id])

		return {
			success: true,
			message: 'Record deleted successfully'
		}
	} catch (error) {
		console.error('Error in deleteQmPurposeRecord:', {
			error,
			stack: error instanceof Error ? error.stack : undefined,
			message: error instanceof Error ? error.message : 'Unknown error'
		})
		throw error
	}
}
