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
 * Response type for QM Purpose operations
 */
export interface QmPurposeResponse {
	success: boolean
	data: QmPurpose[]
	total: number
	page: number
	limit: number
}
