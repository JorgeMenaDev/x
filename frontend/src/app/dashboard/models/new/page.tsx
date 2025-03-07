'use client'

import { Suspense } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ModelReferenceFormProgressive from '@/components/model-reference-form-progressive'
import { ModelReferenceFormSkeleton } from '@/components/model-reference-form-skeleton'

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
	return (
		<QueryClientProvider client={queryClient}>
			<main className='min-h-screen p-8'>
				<div className='mb-8'>
					<h1 className='text-3xl font-bold mb-2'>Models with multiple uses</h1>
					<p className='text-muted-foreground'>Record a model in the inventory with multiple uses</p>
				</div>

				<Suspense fallback={<ModelReferenceFormSkeleton />}>
					<ModelReferenceFormProgressive />
				</Suspense>
			</main>
		</QueryClientProvider>
	)
}
