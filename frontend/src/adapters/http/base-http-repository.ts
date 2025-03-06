/**
 * Base HTTP repository that provides common functionality for all HTTP repositories
 */
import { APIError } from '@/lib/errors'

export class BaseHttpRepository {
	constructor(protected baseUrl: string) {}

	/**
	 * Handles errors from HTTP requests
	 */
	protected async handleError(response: Response): Promise<never> {
		const error = await APIError.fromResponse(response)
		console.error('Repository error:', response)
		throw error
	}

	/**
	 * Makes a GET request to the specified endpoint
	 */
	protected async get<T>(path: string, params?: Record<string, string>): Promise<T> {
		const url = new URL(path, this.baseUrl)
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
			await this.handleError(response)
		}

		return response.json()
	}

	/**
	 * Makes a POST request to the specified endpoint
	 */
	protected async post<T>(path: string, body: unknown): Promise<T> {
		const response = await fetch(new URL(path, this.baseUrl).toString(), {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		})

		if (!response.ok) {
			await this.handleError(response)
		}

		return response.json()
	}

	/**
	 * Makes a PUT request to the specified endpoint
	 */
	protected async put<T>(path: string, body: unknown): Promise<T> {
		const response = await fetch(new URL(path, this.baseUrl).toString(), {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		})

		if (!response.ok) {
			await this.handleError(response)
		}

		return response.json()
	}

	/**
	 * Makes a DELETE request to the specified endpoint
	 */
	protected async delete<T>(path: string): Promise<T> {
		const response = await fetch(new URL(path, this.baseUrl).toString(), {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			}
		})

		if (!response.ok) {
			await this.handleError(response)
		}

		return response.json()
	}
}
