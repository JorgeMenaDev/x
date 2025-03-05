import { QmPurpose, QmPurposeResponse, TablesResponse } from '../../models/inventory/table'

/**
 * Repository interface for interacting with database tables
 */
export interface TablesRepository {
	/**
	 * Fetches all available tables
	 */
	getTables(): Promise<TablesResponse>

	/**
	 * Fetches records from the qm_purpose table
	 * @param page The page number to fetch
	 * @param limit The number of records per page
	 */
	getQmPurposeRecords(page: number, limit: number): Promise<QmPurposeResponse>

	/**
	 * Creates a new record in the qm_purpose table
	 * @param data The data for the new record
	 */
	createQmPurposeRecord(data: Omit<QmPurpose, 'id' | 'created_at' | 'updated_at'>): Promise<QmPurpose>

	/**
	 * Updates an existing record in the qm_purpose table
	 * @param id The ID of the record to update
	 * @param data The updated data
	 */
	updateQmPurposeRecord(
		id: string,
		data: Partial<Omit<QmPurpose, 'id' | 'created_at' | 'updated_at'>>
	): Promise<QmPurpose>

	/**
	 * Deletes a record from the qm_purpose table
	 * @param id The ID of the record to delete
	 */
	deleteQmPurposeRecord(id: string): Promise<void>
}
