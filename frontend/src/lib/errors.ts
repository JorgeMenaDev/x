import { toast } from 'sonner'

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
	constructor(message: string, public code: string, public statusCode: number, public details?: unknown) {
		super(message)
		this.name = 'APIError'
	}

	/**
	 * Create an APIError from a Response object
	 */
	static async fromResponse(response: Response): Promise<APIError> {
		const data = (await response.json()) as APIErrorResponse
		return new APIError(
			data.message || 'An unknown error occurred',
			data.code || 'UNKNOWN_ERROR',
			response.status,
			data.details
		)
	}
}

/**
 * Function to handle API errors and show appropriate toast messages
 */
export function handleAPIError(error: unknown): void {
	if (error instanceof APIError) {
		// Show toast based on error type
		switch (error.code) {
			case 'VALIDATION_ERROR':
				toast.error(`Validation Error: ${error.message}`, {
					description: error.details ? JSON.stringify(error.details) : undefined
				})
				break
			case 'NOT_FOUND':
				toast.error(`Not Found: ${error.message}`)
				break
			default:
				toast.error(`Error: ${error.message}`)
		}
	} else if (error instanceof Error) {
		toast.error(`Unexpected Error: ${error.message}`)
	} else {
		toast.error('An unknown error occurred')
	}

	// Log the error for debugging
	console.error('API Error:', error)
}
