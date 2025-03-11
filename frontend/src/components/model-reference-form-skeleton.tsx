'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export function ModelReferenceFormSkeleton() {
	return (
		<div className='space-y-6'>
			{/* Basic Information Section */}
			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				<div className='space-y-2'>
					<Skeleton className='h-5 w-40' />
					<Skeleton className='h-10 w-full' />
				</div>
				<div className='space-y-2'>
					<Skeleton className='h-5 w-40' />
					<Skeleton className='h-10 w-full' />
				</div>
				<div className='space-y-2'>
					<Skeleton className='h-5 w-40' />
					<Skeleton className='h-10 w-full' />
				</div>
				<div className='space-y-2'>
					<Skeleton className='h-5 w-40' />
					<Skeleton className='h-10 w-full' />
				</div>
				<div className='space-y-2'>
					<Skeleton className='h-5 w-40' />
					<Skeleton className='h-10 w-full' />
				</div>
				<div className='space-y-2'>
					<Skeleton className='h-5 w-40' />
					<Skeleton className='h-10 w-full' />
				</div>
			</div>

			{/* Model Uses Section */}
			<div className='space-y-4'>
				<Skeleton className='h-6 w-48' />

				<Card>
					<CardContent className='pt-6'>
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4'>
							<div className='space-y-2'>
								<Skeleton className='h-5 w-24' />
								<Skeleton className='h-10 w-full' />
							</div>
							<div className='space-y-2'>
								<Skeleton className='h-5 w-24' />
								<Skeleton className='h-10 w-full' />
							</div>
							<div className='space-y-2'>
								<Skeleton className='h-5 w-24' />
								<Skeleton className='h-10 w-full' />
							</div>
							<div className='space-y-2'>
								<Skeleton className='h-5 w-24' />
								<Skeleton className='h-10 w-full' />
							</div>
							<div className='space-y-2'>
								<Skeleton className='h-5 w-24' />
								<Skeleton className='h-10 w-full' />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Submit Button */}
			<div className='flex justify-end'>
				<Skeleton className='h-10 w-32' />
			</div>
		</div>
	)
}
