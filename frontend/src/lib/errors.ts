import { toast } from 'sonner'
import { AxiosError } from 'axios'

export type ErrorType = 'ValidationError' | 'AuthenticationError' | 'NotFoundError' | 'ServerError' | 'NetworkError'

/**
 * Interface for API error responses
 */
export interface APIErrorResponse {
	error: boolean
	code: string
	message: string
	details?: unknown
}

/**
 * Custom error class for API errors
 */
export class APIError extends Error {
	constructor(
		message: string,
		public code: string,
		public statusCode: number,
		public details?: unknown,
		public type: ErrorType = 'ServerError'
	) {
		super(message)
		this.name = 'APIError'
	}

	/**
	 * Create an APIError from a Response object
	 */
	static async fromResponse(response: Response): Promise<APIError> {
		let data: APIErrorResponse
		try {
			data = await response.json()
		} catch (e) {
			// If we can't parse the error response, create a generic one
			return new APIError(
				response.statusText || 'An unknown error occurred',
				'UNKNOWN_ERROR',
				response.status,
				null,
				getErrorTypeFromStatus(response.status)
			)
		}

		return new APIError(
			data.message || 'An unknown error occurred',
			data.code || 'UNKNOWN_ERROR',
			response.status,
			data.details,
			getErrorTypeFromStatus(response.status)
		)
	}
}

/**
 * Get error type based on HTTP status code
 */
function getErrorTypeFromStatus(status: number): ErrorType {
	if (status === 400) return 'ValidationError'
	if (status === 401 || status === 403) return 'AuthenticationError'
	if (status === 404) return 'NotFoundError'
	if (status >= 500) return 'ServerError'
	return 'NetworkError'
}

/**
 * Function to handle API errors and show appropriate toast messages
 */
export const handleAPIError = (error: unknown) => {
	if (error instanceof AxiosError) {
		const errorMessage = error.response?.data?.error || error.message || 'An error occurred'
		toast.error('Error', {
			description: errorMessage
		})
		return
	}

	// Handle other types of errors
	const message = error instanceof Error ? error.message : 'An unexpected error occurred'
	toast.error('Error', {
		description: message
	})
}
