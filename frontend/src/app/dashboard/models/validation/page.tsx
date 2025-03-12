'use client'

import { Suspense } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ErrorBoundary from '@/components/error-boundary'
import { ValidationDashboard } from '@/features/model-validation'

// Create a client
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5, // 5 minutes
			refetchOnWindowFocus: false
		}
	}
})

export default function ModelValidationPage() {
	return (
		<QueryClientProvider client={queryClient}>
			<main className='min-h-screen'>
				<ErrorBoundary>
					<Suspense fallback={<div className='p-8'>Loading validation dashboard...</div>}>
						<ValidationDashboard />
					</Suspense>
				</ErrorBoundary>
			</main>
		</QueryClientProvider>
	)
}
