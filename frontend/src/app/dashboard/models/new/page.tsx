'use client'

import { Suspense, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ModelReferenceForm, ModelReferenceFormSkeleton } from '@/features/models'
import ErrorBoundary from '@/components/error-boundary'

// Create a client
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5, // 5 minutes
			refetchOnWindowFocus: false
		}
	}
})

export default function NewModelPage() {
	// Add debug logging
	useEffect(() => {
		console.log('NewModelPage mounted')

		// Log any unhandled errors
		const errorHandler = (event: ErrorEvent) => {
			console.error('Unhandled error:', event.error)
		}

		window.addEventListener('error', errorHandler)

		return () => {
			window.removeEventListener('error', errorHandler)
		}
	}, [])

	return (
		<QueryClientProvider client={queryClient}>
			<main className='min-h-screen p-8'>
				<div className='mb-8'>
					<h1 className='text-3xl font-bold mb-2'>Models with multiple uses</h1>
					<p className='text-muted-foreground'>Record a model in the inventory with multiple uses</p>
				</div>

				<ErrorBoundary>
					<Suspense fallback={<ModelReferenceFormSkeleton />}>
						<ModelReferenceForm />
					</Suspense>
				</ErrorBoundary>
			</main>
		</QueryClientProvider>
	)
}
