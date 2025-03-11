/**
 * Represents a column in a table
 */
export interface TableColumn {
	name: string
	type: string
	nullable: boolean
	isPrimary: boolean
}

/**
 * Represents the endpoints available for a table
 */
export interface TableEndpoints {
	get: string
	create: string
	update: string
	delete: string
}

/**
 * Represents a table's metadata
 */
export interface TableMetadata {
	name: string
	schema: string
	columns: TableColumn[]
	endpoints: TableEndpoints
}

/**
 * Response from the tables API
 */
export interface TablesResponse {
	success: boolean
	tables: TableMetadata[]
}

/**
 * Generic table record type
 */
export type TableRecord = {
	[key: string]: unknown
}

/**
 * Generic table data response
 */
export interface TableDataResponse<T = TableRecord> {
	success: boolean
	data: T[]
	total: number
	page: number
	limit: number
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
