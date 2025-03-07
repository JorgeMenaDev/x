import { Database } from 'bun:sqlite'

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
		this.db = new Database('inventory.db')
		// Example table creation (run once or in a migration script)
		this.db.run('CREATE TABLE IF NOT EXISTS qm_purpose (id TEXT PRIMARY KEY, text TEXT)')
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
		const columns = Object.keys(data).join(', ')
		const placeholders = Object.keys(data)
			.map(() => '?')
			.join(', ')
		const query = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`
		const statement = this.db.prepare(query)
		const result = statement.run(...Object.values(data))
		return data.id || result.lastInsertRowid?.toString() // Fallback to provided ID or last inserted ID
	}

	async updateRow(tableName: string, id: string, data: Record<string, any>) {
		// Check if data is empty
		if (!data || Object.keys(data).length === 0) {
			throw new Error('No columns to update')
		}

		const updates = Object.entries(data)
			.map(([key]) => `${key} = ?`)
			.join(', ')
		const query = `UPDATE ${tableName} SET ${updates} WHERE id = ?`
		this.db.query(query).run(...[...Object.values(data), id])
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
