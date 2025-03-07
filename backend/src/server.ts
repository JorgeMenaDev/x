import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { StatusCodes } from 'http-status-codes'
import inventoryRoutes from './routes/inventory'
import seedRoutes from './routes/seed'
import tableRoutes from './routes/tables'
import { APIError, ErrorResponse } from './lib/errors'
import './db/init'

// Load environment variables - Bun has built-in support for .env files
const port = Number(Bun.env.PORT) || 8000
const allowedOrigins = Bun.env.ALLOWED_ORIGINS?.split(',') || ['*']

console.log('Allowed origins:', allowedOrigins)

// Initialize the app
const app = new Elysia()
	.use(
		cors({
			origin: allowedOrigins.includes('*') ? '*' : allowedOrigins,
			methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
			allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
		})
	)
	// Add request logger middleware
	.onRequest(({ request }) => {
		console.log(`${request.method} ${request.url}`)
	})
	// Add error handling middleware
	.onError(({ code, error, set }): ErrorResponse => {
		console.error('Server error:', {
			error,
			code,
			message: error instanceof Error ? error.message : 'No message available'
		})

		// Handle known errors
		if (error instanceof APIError) {
			set.status = error.statusCode
			return {
				error: true,
				code: error.code,
				message: error.message,
				details: error.details,
				...(process.env.NODE_ENV !== 'production' && {
					stack: error.stack
				})
			}
		}

		// Handle Elysia's built-in errors
		switch (code) {
			case 'NOT_FOUND':
				set.status = StatusCodes.NOT_FOUND
				return {
					error: true,
					code: 'NOT_FOUND',
					message: 'Resource not found'
				}
			case 'VALIDATION':
				set.status = StatusCodes.BAD_REQUEST
				return {
					error: true,
					code: 'VALIDATION_ERROR',
					message: error instanceof Error ? error.message : 'Validation error',
					details: error
				}
			case 'PARSE':
				set.status = StatusCodes.BAD_REQUEST
				return {
					error: true,
					code: 'PARSE_ERROR',
					message: error instanceof Error ? error.message : 'Parse error',
					details: error
				}
			default:
				set.status = StatusCodes.INTERNAL_SERVER_ERROR
				return {
					error: true,
					code: 'INTERNAL_SERVER_ERROR',
					message: error instanceof Error ? error.message : 'Internal Server Error',
					...(process.env.NODE_ENV !== 'production' && {
						stack: error instanceof Error ? error.stack : undefined,
						details: error
					})
				}
		}
	})
	// Health check endpoint
	.get('/api/health', () => ({
		status: 'ok',
		timestamp: new Date().toISOString()
	}))
	// Mount routes
	.group('/api', app => app.use(inventoryRoutes).use(seedRoutes).use(tableRoutes))

// Start the server
app.listen(port, () => {
	console.log(`Server running on http://0.0.0.0:${port}`)
})
