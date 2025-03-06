/**
 * Base HTTP repository that provides common functionality for all HTTP repositories
 */
export class BaseHttpRepository {
	protected baseUrl: string

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl
	}

	/**
	 * Handles errors from HTTP requests
	 */
	protected handleError(error: unknown): never {
		console.error('Repository error:', error)

		if (error instanceof Response) {
			throw new Error(`HTTP error: ${error.status} ${error.statusText}`)
		}

		if (error instanceof Error) {
			throw error
		}

		throw new Error('Unknown error occurred')
	}

	/**
	 * Makes a GET request to the specified endpoint
	 */
	protected async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
		try {
			const url = new URL(`${this.baseUrl}${endpoint}`)

			if (params) {
				Object.entries(params).forEach(([key, value]) => {
					url.searchParams.append(key, value)
				})
			}

			const response = await fetch(url.toString(), {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json'
				}
			})

			if (!response.ok) {
				throw response
			}

			return (await response.json()) as T
		} catch (error) {
			return this.handleError(error)
		}
	}

	/**
	 * Makes a POST request to the specified endpoint
	 */
	protected async post<T>(endpoint: string, data: unknown): Promise<T> {
		try {
			const response = await fetch(`${this.baseUrl}${endpoint}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			})

			if (!response.ok) {
				throw response
			}

			return (await response.json()) as T
		} catch (error) {
			return this.handleError(error)
		}
	}

	/**
	 * Makes a PUT request to the specified endpoint
	 */
	protected async put<T>(endpoint: string, data: unknown): Promise<T> {
		try {
			const response = await fetch(`${this.baseUrl}${endpoint}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			})

			if (!response.ok) {
				throw response
			}

			return (await response.json()) as T
		} catch (error) {
			return this.handleError(error)
		}
	}

	/**
	 * Makes a DELETE request to the specified endpoint
	 */
	protected async delete<T>(endpoint: string): Promise<T> {
		try {
			const response = await fetch(`${this.baseUrl}${endpoint}`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				}
			})

			if (!response.ok) {
				throw response
			}

			return (await response.json()) as T
		} catch (error) {
			return this.handleError(error)
		}
	}
}
