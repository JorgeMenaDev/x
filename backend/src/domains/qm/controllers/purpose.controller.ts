import { getDB, generateUUID } from '../../../db/database'
import { QmPurpose } from '../models/purpose.model'

// Get records from the qm_purpose table with pagination
export const getRecords = ({ query }: { query: { page?: string; limit?: string } }) => {
	try {
		const db = getDB()
		const page = parseInt(query.page || '1')
		const limit = parseInt(query.limit || '100')
		const offset = (page - 1) * limit

		const countResult = db.query('SELECT COUNT(*) as count FROM qm_purpose').get() as { count: number }
		const total = countResult?.count || 0

		const records = db
			.query(
				`
			SELECT * FROM qm_purpose
			ORDER BY created_at DESC
			LIMIT ${limit} OFFSET ${offset}
		`
			)
			.all()

		return { success: true, data: records, total, page, limit }
	} catch (error) {
		console.error('Error fetching QM Purpose records:', error)
		throw new Error('Failed to fetch QM Purpose records')
	}
}

// Create a new QM Purpose record
export const create = ({ body }: { body: { text: string } }) => {
	try {
		if (!body.text) throw new Error('Text is required')

		const db = getDB()
		const id = generateUUID()
		const now = new Date().toISOString()

		db.query(
			`
			INSERT INTO qm_purpose (id, text, created_at, updated_at)
			VALUES ($id, $text, $created_at, $updated_at)
		`
		).run({
			$id: id,
			$text: body.text,
			$created_at: now,
			$updated_at: now
		})

		return {
			success: true,
			data: { id, text: body.text, created_at: now, updated_at: now }
		}
	} catch (error) {
		console.error('Error creating QM Purpose record:', error)
		throw error
	}
}

// Update an existing QM Purpose record
export const update = ({ params, body }: { params: { id: string }; body: { text: string } }) => {
	try {
		if (!body.text) throw new Error('Text is required')

		const db = getDB()
		const existingRecord = db.query('SELECT * FROM qm_purpose WHERE id = $id').get({ $id: params.id }) as
			| QmPurpose
			| undefined

		if (!existingRecord) throw new Error('Record not found')

		const now = new Date().toISOString()
		db.query(
			`
			UPDATE qm_purpose
			SET text = $text, updated_at = $updated_at
			WHERE id = $id
		`
		).run({
			$text: body.text,
			$updated_at: now,
			$id: params.id
		})

		return {
			success: true,
			data: {
				id: params.id,
				text: body.text,
				created_at: existingRecord.created_at,
				updated_at: now
			}
		}
	} catch (error) {
		console.error('Error updating QM Purpose record:', error)
		throw error
	}
}

// Delete a QM Purpose record
export const remove = ({ params }: { params: { id: string } }) => {
	try {
		const db = getDB()
		const existingRecord = db.query('SELECT * FROM qm_purpose WHERE id = $id').get({ $id: params.id }) as
			| QmPurpose
			| undefined

		if (!existingRecord) throw new Error('Record not found')

		db.query('DELETE FROM qm_purpose WHERE id = $id').run({ $id: params.id })

		return { success: true, message: 'Record deleted successfully' }
	} catch (error) {
		console.error('Error deleting QM Purpose record:', error)
		throw error
	}
}
