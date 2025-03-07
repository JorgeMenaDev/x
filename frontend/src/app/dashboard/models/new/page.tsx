'use client'

import { useState, Suspense } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ModelReferenceForm from '@/components/model-reference-form'
import ModelReferenceFormProgressive from '@/components/model-reference-form-progressive'
import { ModelReferenceFormSkeleton } from '@/components/model-reference-form-skeleton'
import { Button } from '@/components/ui/button'
import modelReferenceData from '@/schemas/modelReferenceData.json'

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
	const [useProgressiveForm, setUseProgressiveForm] = useState(true)

	return (
		<QueryClientProvider client={queryClient}>
			<main className='min-h-screen p-8'>
				<div className='mb-8'>
					<h1 className='text-3xl font-bold mb-2'>Models with multiple uses</h1>
					<p className='text-muted-foreground'>Record a model in the inventory with multiple uses</p>
				</div>

				<div className='mb-6'>
					<Button variant='outline' onClick={() => setUseProgressiveForm(!useProgressiveForm)} className='mb-2'>
						{useProgressiveForm ? 'Switch to Original Form (Hardcoded Data)' : 'Switch to Progressive Form (API Data)'}
					</Button>
					<p className='text-sm text-muted-foreground'>
						{useProgressiveForm
							? 'Currently using: Progressive loading form with API data and individual loading states'
							: 'Currently using: Original form with hardcoded data and tabs for entry/preview'}
					</p>
				</div>

				{useProgressiveForm ? (
					// Progressive loading form with API data
					<Suspense fallback={<ModelReferenceFormSkeleton />}>
						<ModelReferenceFormProgressive />
					</Suspense>
				) : (
					// Original form with hardcoded data
					<ModelReferenceForm modelReferenceData={modelReferenceData} />
				)}
			</main>
		</QueryClientProvider>
	)
}
