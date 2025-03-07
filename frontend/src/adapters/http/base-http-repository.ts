/**
 * Base HTTP repository that provides common functionality for all HTTP repositories
 */
import { typedApi } from '@/lib/api-client'

export class BaseHttpRepository {
	constructor(protected baseUrl: string) {}

	/**
	 * Makes a GET request to the specified endpoint
	 */
	protected async get<T>(path: string, params?: Record<string, string>): Promise<T> {
		return typedApi.get<T>(new URL(path, this.baseUrl).toString(), { params })
	}

	/**
	 * Makes a POST request to the specified endpoint
	 */
	protected async post<T>(path: string, body: unknown): Promise<T> {
		return typedApi.post<T>(new URL(path, this.baseUrl).toString(), body)
	}

	/**
	 * Makes a PUT request to the specified endpoint
	 */
	protected async put<T>(path: string, body: unknown): Promise<T> {
		return typedApi.put<T>(new URL(path, this.baseUrl).toString(), body)
	}

	/**
	 * Makes a DELETE request to the specified endpoint
	 */
	protected async delete<T>(path: string, body?: unknown): Promise<T> {
		return typedApi.delete<T>(new URL(path, this.baseUrl).toString(), { data: body })
	}
}
