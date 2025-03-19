import { Database } from 'bun:sqlite'
import { v4 as uuidv4 } from 'uuid'
import config from '../config'

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

export class InventoryRepository {
	private db: Database

	constructor() {
		this.db = new Database(config.dbPath)
		// Create qm_purpose table if it doesn't exist
		// this.db.run('CREATE TABLE IF NOT EXISTS qm_purpose (id TEXT PRIMARY KEY, text TEXT)')
	}

	async getTables() {
		// Get all table names from the SQLite master table
		const tables = this.db
			.query('SELECT name FROM sqlite_master WHERE type="table" AND name NOT LIKE "sqlite_%"')
			.all() as {
			name: string
		}[]

		// Get column information for each table
		const tablesWithMetadata = tables.map(table => {
			const columns = this.db.query(`PRAGMA table_info(${table.name})`).all() as PragmaResult[]

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
	}

	async fetchTableData(tableName: string, page: number, limit: number, filters: Record<string, any>, pause: boolean) {
		const offset = (page - 1) * limit
		let query = `SELECT * FROM ${tableName}`
		const params: any[] = []

		if (Object.keys(filters).length > 0) {
			const conditions = Object.entries(filters)
				.map(([key, value]) => `${key} = ?`)
				.join(' AND ')
			query += ` WHERE ${conditions}`
			params.push(...Object.values(filters))
		}

		query += ` LIMIT ? OFFSET ?`
		params.push(limit, offset)

		const rows = this.db.query(query).all(...params)
		return { data: rows, page, limit, total: await this.getTotalRows(tableName, filters) }
	}

	async createRow(tableName: string, data: Record<string, any>) {
		// Check if the table has an INTEGER PRIMARY KEY (auto-increment)
		const tableInfo = this.db.query(`PRAGMA table_info(${tableName})`).all() as PragmaResult[]
		const primaryKeyColumn = tableInfo.find(col => col.pk === 1)
		const isAutoIncrement = primaryKeyColumn && primaryKeyColumn.type.toUpperCase() === 'INTEGER'

		// Only generate a UUID for "id" if not provided and not auto-increment
		if (!data.id && !isAutoIncrement) {
			data.id = uuidv4()
		}

		// Remove id from data if it's null/undefined and the table has auto-increment
		if (data.id === undefined && isAutoIncrement) {
			delete data.id
		}

		// Set timestamps to current time if not provided
		const now = new Date().toISOString()
		if (!data.created_at) {
			data.created_at = now
		}
		if (!data.updated_at) {
			data.updated_at = now
		}

		// Skip if no columns left after filtering
		if (Object.keys(data).length === 0) {
			throw new Error('No valid columns to insert')
		}

		const columns = Object.keys(data).join(', ')
		const placeholders = Object.keys(data)
			.map(() => '?')
			.join(', ')
		const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`
		const statement = this.db.prepare(query)
		const result = statement.run(...Object.values(data))
		console.log(result)

		// Return the ID (either provided, or the auto-generated one)
		return data.id || result.lastInsertRowid?.toString()
	}

	async updateRow(tableName: string, id: string, data: Record<string, any>) {
		// Check if data is empty
		if (!data || Object.keys(data).length === 0) {
			throw new Error('No columns to update')
		}

		// Get table info to find the primary key column
		const tableInfo = this.db.query(`PRAGMA table_info(${tableName})`).all() as PragmaResult[]
		const primaryKeyColumn = tableInfo.find(col => col.pk === 1)?.name || 'id'

		const updates = Object.entries(data)
			.map(([key]) => `${key} = ?`)
			.join(', ')
		const query = `UPDATE ${tableName} SET ${updates} WHERE ${primaryKeyColumn} = ?`
		try {
			this.db.query(query).run(...[...Object.values(data), id])
		} catch (error) {
			console.error('Update error:', error)
			throw error // Re-throw the error to be handled by the controller
		}
	}

	async deleteRow(tableName: string, id: string) {
		const query = `DELETE FROM ${tableName} WHERE id = ?`
		this.db.query(query).run(id)
	}

	private async getTotalRows(tableName: string, filters: Record<string, any>) {
		let query = `SELECT COUNT(*) as total FROM ${tableName}`
		const params: any[] = []

		if (Object.keys(filters).length > 0) {
			const conditions = Object.entries(filters)
				.map(([key, value]) => `${key} = ?`)
				.join(' AND ')
			query += ` WHERE ${conditions}`
			params.push(...Object.values(filters))
		}

		const result = this.db.query(query).get(...params) as { total: number }
		return result.total
	}
}
