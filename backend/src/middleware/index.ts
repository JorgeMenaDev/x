import { StatusCodes } from 'http-status-codes'
import type { ErrorHandler } from 'elysia'

// Error handling middleware

export const errorHandler: ErrorHandler = ({ error, set }) => {
	console.error('Error:', error)
	// @ts-ignore
	set.status = error.status || StatusCodes.INTERNAL_SERVER_ERROR
	return {
		// @ts-ignore
		error: error.message || 'Internal Server Error',
		status: set.status
	}
}

// Request logger middleware
export const requestLogger = ({ request }: { request: Request }) => {
	const timestamp = new Date().toISOString()
	console.log(`[${timestamp}] ${request.method} ${request.url}`)
}
