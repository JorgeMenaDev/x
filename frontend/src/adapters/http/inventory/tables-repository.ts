import { QmPurpose, QmPurposeResponse, TablesResponse } from '../../../models/inventory/table'
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
	 * Fetches all available tables
	 */
	async getTables(): Promise<TablesResponse> {
		return this.get<TablesResponse>('/api/v1/inventory/tables')
	}

	/**
	 * Fetches records from the qm_purpose table
	 * @param page The page number to fetch
	 * @param limit The number of records per page
	 */
	async getQmPurposeRecords(page: number, limit: number): Promise<QmPurposeResponse> {
		return this.get<QmPurposeResponse>('/api/v1/inventory/tables/qm_purpose', {
			page: page.toString(),
			limit: limit.toString()
		})
	}

	/**
	 * Creates a new record in the qm_purpose table
	 * @param data The data for the new record
	 */
	async createQmPurposeRecord(data: Omit<QmPurpose, 'id' | 'created_at' | 'updated_at'>): Promise<QmPurpose> {
		return this.post<QmPurpose>('/api/v1/inventory/tables/qm_purpose', data)
	}

	/**
	 * Updates an existing record in the qm_purpose table
	 * @param id The ID of the record to update
	 * @param data The updated data
	 */
	async updateQmPurposeRecord(
		id: string,
		data: Partial<Omit<QmPurpose, 'id' | 'created_at' | 'updated_at'>>
	): Promise<QmPurpose> {
		return this.put<QmPurpose>(`/api/v1/inventory/tables/qm_purpose/${id}`, data)
	}

	/**
	 * Deletes a record from the qm_purpose table
	 * @param id The ID of the record to delete
	 */
	async deleteQmPurposeRecord(id: string): Promise<void> {
		return this.delete<void>(`/api/v1/inventory/tables/qm_purpose/${id}`)
	}
}
