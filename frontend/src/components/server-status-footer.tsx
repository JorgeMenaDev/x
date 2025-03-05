'use client'

import { useServerHealth } from '@/hooks/useServerHealth'
import { cn } from '@/lib/utils'

/**
 * Footer component that displays the server health status
 * Shows a green dot when the server is healthy, red when there's an issue
 */
export function ServerStatusFooter() {
	const { data, isLoading, isError } = useServerHealth()

	// Determine status indicator color
	const isHealthy = !isLoading && !isError && data?.status === 'ok'

	return (
		<footer className='w-full border-t py-2 px-4 flex items-center justify-between text-sm text-muted-foreground'>
			<div className='flex items-center gap-2'>
				<div
					className={cn(
						'h-2 w-2 rounded-full',
						isLoading ? 'bg-yellow-400' : isHealthy ? 'bg-green-500' : 'bg-red-500'
					)}
					title={isLoading ? 'Checking server status...' : isHealthy ? 'Server is healthy' : 'Server is not responding'}
				/>
				<span>
					{isLoading ? 'Checking server status...' : isHealthy ? 'Server is online' : 'Server connection issue'}
				</span>
			</div>
			{isHealthy && <span className='text-xs'>Last updated: {new Date(data.timestamp).toLocaleTimeString()}</span>}
		</footer>
	)
}
