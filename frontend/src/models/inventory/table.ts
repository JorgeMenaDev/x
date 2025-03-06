/**
 * Represents a database table in the system
 */
export interface Table {
	name: string
	schema: string
}

/**
 * Represents the response from the API when fetching tables
 */
export interface TablesResponse {
	tables: Table[]
}

/**
 * Represents a record in the qm_purpose table
 */
export interface QmPurpose {
	id: string
	text: string
	created_at: string
	updated_at: string
}

/**
 * Represents the response from the API when fetching qm_purpose records
 */
export interface QmPurposeResponse {
	data: QmPurpose[]
	total: number
}
