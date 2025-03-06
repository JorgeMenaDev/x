import { TablesResponse, TableDataResponse, TableRecord } from '../../models/inventory/table'

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
	 * @param page The page number to fetch
	 * @param limit The number of records per page
	 */
	getTableRecords<T = TableRecord>(tableName: string, page: number, limit: number): Promise<TableDataResponse<T>>

	/**
	 * Creates a new record in any table
	 * @param tableName The name of the table
	 * @param data The data for the new record
	 */
	createTableRecord<T = TableRecord>(tableName: string, data: Partial<T>): Promise<T>

	/**
	 * Updates an existing record in any table
	 * @param tableName The name of the table
	 * @param id The ID of the record to update
	 * @param data The updated data
	 */
	updateTableRecord<T = TableRecord>(tableName: string, id: string, data: Partial<T>): Promise<T>

	/**
	 * Deletes a record from any table
	 * @param tableName The name of the table
	 * @param id The ID of the record to delete
	 */
	deleteTableRecord(tableName: string, id: string): Promise<void>
}
