import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { useNotifications } from '@/components/notifications/notifications-store'

// Match backend error structure
interface APIErrorResponse {
	error: boolean
	code: string
	message: string
	details?: unknown
	stack?: string
}

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
	if (config.headers) {
		config.headers.Accept = 'application/json'
		config.headers['Content-Type'] = 'application/json'
	}

	return config
}

export const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
	headers: {
		'Content-Type': 'application/json'
	}
})

api.interceptors.request.use(authRequestInterceptor)
api.interceptors.response.use(
	response => {
		return response.data
	},
	(error: AxiosError<APIErrorResponse>) => {
		const apiError = error.response?.data
		const statusCode = error.response?.status
		const errorMessage = apiError
			? `${apiError.message} ${apiError.details ? `(${JSON.stringify(apiError.details)})` : ''}`
			: error.message

		useNotifications.getState().addNotification({
			type: 'error',
			title: apiError?.code || 'Error',
			message: `${errorMessage}${statusCode ? ` (Status: ${statusCode})` : ''}`
		})

		return Promise.reject(error)
	}
)

// Type-safe API instance
export interface ApiConfig {
	params?: Record<string, string>
	headers?: Record<string, string>
	data?: unknown // Add support for request body in DELETE requests
}

export type ApiInstance = {
	get<T>(url: string, config?: ApiConfig): Promise<T>
	post<T>(url: string, data?: unknown, config?: ApiConfig): Promise<T>
	put<T>(url: string, data?: unknown, config?: ApiConfig): Promise<T>
	delete<T>(url: string, config?: ApiConfig): Promise<T>
}

export const typedApi = api as unknown as ApiInstance
