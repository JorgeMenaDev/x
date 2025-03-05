'use client'

import { useQuery } from '@tanstack/react-query'

/**
 * Custom hook to check the server health status
 * @param interval - Polling interval in milliseconds (default: 30000ms)
 * @returns Object containing health status data and query state
 */
export function useServerHealth(interval = 30000) {
	return useQuery({
		queryKey: ['serverHealth'],
		queryFn: async () => {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/health`)

			if (!response.ok) {
				throw new Error('Server health check failed')
			}

			return response.json()
		},
		refetchInterval: interval,
		refetchOnWindowFocus: true,
		retry: 3
	})
}
