'use client'

import { Suspense } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ModelReferenceForm from '@/components/model-reference-form'
// Note: We're keeping ModelReferenceFormProgressive component in the codebase
// but not importing it here as requested by the user
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

				{/* Use only the ModelReferenceForm with a loading state */}
				<Suspense fallback={<ModelReferenceFormSkeleton />}>
					<ModelReferenceForm />
				</Suspense>
			</main>
		</QueryClientProvider>
	)
}
