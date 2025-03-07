import { TablesResponse, TableDataResponse, TableRecord } from '../../models/inventory/table'

/**
 * Type for filter values that can be sent to the API
 */
export type FilterValue = string | number | boolean | null

/**
 * Repository interface for interacting with database tables
 */
export interface TablesRepository {
	/**
	 * Fetches all available tables with their metadata
	 */
	getTables(): Promise<TablesResponse>

	/**
	 * Fetches records from any table
	 * @param tableName The name of the table
	 * @param params Optional parameters for pagination, filtering, and pausing
	 */
	getTableData<T = TableRecord>(
		tableName: string,
		params?: {
			page?: number
			limit?: number
			filters?: Record<string, FilterValue>
			pause?: boolean
		}
	): Promise<TableDataResponse<T>>

	/**
	 * Creates a new record in any table
	 * @param tableName The name of the table
	 * @param data The data for the new record
	 * @param id Optional ID for the new record (auto-generated if omitted)
	 */
	createTableRow<T = TableRecord>(
		tableName: string,
		data: Record<string, FilterValue | unknown>,
		id?: string
	): Promise<T>

	/**
	 * Updates an existing record in any table
	 * @param tableName The name of the table
	 * @param id The ID of the record to update
	 * @param data The updated data
	 */
	updateTableRow<T = TableRecord>(
		tableName: string,
		id: string,
		data: Record<string, FilterValue | unknown>
	): Promise<T>

	/**
	 * Deletes a record from any table
	 * @param tableName The name of the table
	 * @param id The ID of the record to delete
	 */
	deleteTableRow(tableName: string, id: string): Promise<void>
}
