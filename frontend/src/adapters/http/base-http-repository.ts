/**
 * Base HTTP repository that provides common functionality for all HTTP repositories
 */
import { api } from '@/lib/api-client'
import { AxiosResponse } from 'axios'

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
		const response = await api.get<T>(new URL(path, this.baseUrl).toString(), { params })
		return response.data
	}

	/**
	 * Makes a POST request to the specified endpoint
	 */
	protected async post<T>(path: string, body: unknown): Promise<T> {
		const response = await api.post<T>(new URL(path, this.baseUrl).toString(), body)
		return response.data
	}

	/**
	 * Makes a PUT request to the specified endpoint
	 */
	protected async put<T>(path: string, body: unknown): Promise<T> {
		const response = await api.put<T>(new URL(path, this.baseUrl).toString(), body)
		return response.data
	}

	/**
	 * Makes a DELETE request to the specified endpoint
	 */
	protected async delete<T>(path: string): Promise<T> {
		const response = await api.delete<T>(new URL(path, this.baseUrl).toString())
		return response.data
	}
}
