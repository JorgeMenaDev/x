/**
 * Custom error class for API errors
 */
export class APIError extends Error {
	constructor(
		message: string,
		public statusCode: number = 500,
		public code: string = 'INTERNAL_SERVER_ERROR',
		public details?: unknown
	) {
		super(message)
		this.name = 'APIError'
	}
}

/**
 * Custom error class for validation errors
 */
export class ValidationError extends APIError {
	constructor(message: string, details?: unknown) {
		super(message, 400, 'VALIDATION_ERROR', details)
		this.name = 'ValidationError'
	}
}

/**
 * Custom error class for not found errors
 */
export class NotFoundError extends APIError {
	constructor(message: string) {
		super(message, 404, 'NOT_FOUND')
		this.name = 'NotFoundError'
	}
}

/**
 * Error response interface
 */
export interface ErrorResponse {
	error: true
	code: string
	message: string
	details?: unknown
	stack?: string
}
