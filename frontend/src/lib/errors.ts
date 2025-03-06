import { toast } from 'sonner'

export type ErrorType = 'ValidationError' | 'AuthenticationError' | 'NotFoundError' | 'ServerError' | 'NetworkError'

/**
 * Interface for API error responses
 */
export interface APIErrorResponse {
	error: true
	code: string
	message: string
	details?: unknown
	stack?: string
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
export function handleAPIError(error: unknown): void {
	if (error instanceof APIError) {
		// Show toast based on error type
		switch (error.type) {
			case 'ValidationError':
				toast.error(`Validation Error: ${error.message}`, {
					description: error.details ? JSON.stringify(error.details) : undefined
				})
				break
			case 'AuthenticationError':
				toast.error('Authentication Error', {
					description: 'Please log in again to continue.'
				})
				break
			case 'NotFoundError':
				toast.error(`Not Found: ${error.message}`)
				break
			case 'ServerError':
				toast.error('Server Error', {
					description: 'Our team has been notified. Please try again later.'
				})
				break
			case 'NetworkError':
				toast.error('Network Error', {
					description: 'Please check your internet connection and try again.'
				})
				break
			default:
				toast.error(`Error: ${error.message}`)
		}

		// Log the error for debugging
		if (process.env.NODE_ENV !== 'production') {
			console.group('API Error')
			console.error('Type:', error.type)
			console.error('Code:', error.code)
			console.error('Message:', error.message)
			console.error('Status:', error.statusCode)
			if (error.details) console.error('Details:', error.details)
			if (error.stack) console.error('Stack:', error.stack)
			console.groupEnd()
		} else {
			// In production, we might want to send this to an error tracking service
			console.error('API Error:', {
				type: error.type,
				code: error.code,
				message: error.message,
				status: error.statusCode
			})
		}
	} else if (error instanceof Error) {
		toast.error(`Unexpected Error: ${error.message}`)
		console.error('Unexpected Error:', error)
	} else {
		toast.error('An unknown error occurred')
		console.error('Unknown Error:', error)
	}
}
