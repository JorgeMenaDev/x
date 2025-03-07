import { TablesResponse, TableDataResponse, TableRecord } from '../../../models/inventory/table'
import { FilterValue, TablesRepository } from '../../../repositories/inventory/tables-repository'
import { BaseHttpRepository } from '../base-http-repository'

/**
 * HTTP implementation of the TablesRepository interface
 */
export class HttpTablesRepository extends BaseHttpRepository implements TablesRepository {
	constructor(baseUrl: string) {
		super(baseUrl)
	}

	/**
	 * Fetches all available tables with their metadata
	 */
	async getTables(): Promise<TablesResponse> {
		return this.get<TablesResponse>('/api/v1/inventory/tables')
	}

	/**
	 * Fetches records from any table with support for pagination, filtering, and pausing
	 */
	async getTableData<T = TableRecord>(
		tableName: string,
		params?: {
			page?: number
			limit?: number
			filters?: Record<string, FilterValue>
			pause?: boolean
		}
	): Promise<TableDataResponse<T>> {
		const { page = 1, limit = 10, filters = {}, pause = false } = params || {}

		// Convert params to query string parameters
		const queryParams: Record<string, string> = {
			page: page.toString(),
			limit: limit.toString()
		}

		// Add filters as JSON string if provided
		if (Object.keys(filters).length > 0) {
			queryParams.filters = JSON.stringify(filters)
		}

		// Add pause parameter if true
		if (pause) {
			queryParams.pause = 'true'
		}

		return this.get<TableDataResponse<T>>(`/api/v1/inventory/data/${tableName}`, queryParams)
	}

	/**
	 * Creates a new record in any table
	 */
	async createTableRow<T = TableRecord>(
		tableName: string,
		data: Record<string, FilterValue | unknown>,
		id?: string
	): Promise<T> {
		const payload = {
			id,
			data
		}

		return this.post<T>(`/api/v1/inventory/data/${tableName}`, payload)
	}

	/**
	 * Updates an existing record in any table
	 */
	async updateTableRow<T = TableRecord>(
		tableName: string,
		id: string,
		data: Record<string, FilterValue | unknown>
	): Promise<T> {
		const payload = {
			id,
			data
		}

		return this.put<T>(`/api/v1/inventory/data/${tableName}`, payload)
	}

	/**
	 * Deletes a record from any table
	 */
	async deleteTableRow(tableName: string, id: string): Promise<void> {
		const payload = { id }

		return this.delete<void>(`/api/v1/inventory/data/${tableName}`, payload)
	}
}
