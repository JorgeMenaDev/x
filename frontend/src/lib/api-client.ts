import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { useNotifications } from '@/components/notifications/notifications-store'

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
	if (config.headers) {
		config.headers.Accept = 'application/json'
		config.headers['Content-Type'] = 'application/json'
	}

	return config
}

export const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
	withCredentials: true
})

api.interceptors.request.use(authRequestInterceptor)
api.interceptors.response.use(
	response => response.data,
	(error: AxiosError) => {
		const message = error.response?.data?.message || error.message
		useNotifications.getState().addNotification({
			type: 'error',
			title: 'Error',
			message
		})

		return Promise.reject(error)
	}
)
