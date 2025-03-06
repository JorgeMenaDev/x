import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { StatusCodes } from 'http-status-codes'
import inventoryRoutes from './routes/inventory'
import seedRoutes from './routes/seed'
import './db/init'

// Load environment variables - Bun has built-in support for .env files
const port = Number(Bun.env.PORT) || 3000
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
	.onError(({ code, error, set }) => {
		console.error('Server error:', {
			error,
			code,
			message: error instanceof Error ? error.message : 'No message available'
		})

		switch (code) {
			case 'NOT_FOUND':
				set.status = StatusCodes.NOT_FOUND
				break
			case 'VALIDATION':
				set.status = StatusCodes.BAD_REQUEST
				break
			case 'PARSE':
				set.status = StatusCodes.BAD_REQUEST
				break
			default:
				set.status = StatusCodes.INTERNAL_SERVER_ERROR
		}

		return {
			error: true,
			message: error instanceof Error ? error.message : 'Internal Server Error',
			status: set.status,
			...(process.env.NODE_ENV !== 'production' && {
				stack: error instanceof Error ? error.stack : undefined,
				cause: error instanceof Error ? error.cause : undefined
			})
		}
	})
	// Health check endpoint
	.get('/api/health', () => ({
		status: 'ok',
		timestamp: new Date().toISOString()
	}))
	// Mount routes
	.group('/api', app => app.use(inventoryRoutes).use(seedRoutes))

// Start the server
app.listen(port, () => {
	console.log(`Server running on http://0.0.0.0:${port}`)
})
