import { TablesResponse, TableDataResponse, TableRecord } from '../../../models/inventory/table'
import { TablesRepository } from '../../../repositories/inventory/tables-repository'
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
	 * Fetches records from any table
	 */
	async getTableRecords<T = TableRecord>(
		tableName: string,
		page: number,
		limit: number
	): Promise<TableDataResponse<T>> {
		return this.get<TableDataResponse<T>>(`/api/v1/tables/${tableName}`, {
			page: page.toString(),
			limit: limit.toString()
		})
	}

	/**
	 * Fetches records from the qm_purpose table
	 */
	async getQmPurposeRecords(page: number, limit: number): Promise<TableDataResponse<TableRecord>> {
		return this.getTableRecords('qm_purpose', page, limit)
	}

	/**
	 * Creates a new record in any table
	 */
	async createTableRecord<T = TableRecord>(tableName: string, data: Partial<T>): Promise<T> {
		return this.post<T>(`/api/v1/tables/${tableName}`, data)
	}

	/**
	 * Updates an existing record in any table
	 */
	async updateTableRecord<T = TableRecord>(tableName: string, id: string, data: Partial<T>): Promise<T> {
		return this.put<T>(`/api/v1/tables/${tableName}/${id}`, data)
	}

	/**
	 * Deletes a record from any table
	 */
	async deleteTableRecord(tableName: string, id: string): Promise<void> {
		return this.delete<void>(`/api/v1/tables/${tableName}/${id}`)
	}
}
