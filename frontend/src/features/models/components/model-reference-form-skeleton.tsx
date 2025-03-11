'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export function ModelReferenceFormSkeleton() {
	return (
		<Card>
			<CardContent className='pt-6 space-y-8'>
				<div className='space-y-4'>
					<div className='space-y-2'>
						<Skeleton className='h-8 w-[250px]' />
						<Skeleton className='h-4 w-[300px]' />
					</div>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<div className='space-y-2'>
							<Skeleton className='h-4 w-[100px]' />
							<Skeleton className='h-10 w-full' />
						</div>
						<div className='space-y-2'>
							<Skeleton className='h-4 w-[100px]' />
							<Skeleton className='h-10 w-full' />
						</div>
						<div className='space-y-2'>
							<Skeleton className='h-4 w-[100px]' />
							<Skeleton className='h-10 w-full' />
						</div>
						<div className='space-y-2'>
							<Skeleton className='h-4 w-[100px]' />
							<Skeleton className='h-10 w-full' />
						</div>
						<div className='space-y-2'>
							<Skeleton className='h-4 w-[100px]' />
							<Skeleton className='h-10 w-full' />
						</div>
						<div className='space-y-2'>
							<Skeleton className='h-4 w-[100px]' />
							<Skeleton className='h-10 w-full' />
						</div>
					</div>
				</div>

				<div className='space-y-4'>
					<div className='flex justify-between items-center'>
						<Skeleton className='h-6 w-[150px]' />
						<Skeleton className='h-9 w-[150px]' />
					</div>
					<div className='p-4 border rounded-md space-y-4'>
						<div className='flex justify-between items-center'>
							<Skeleton className='h-5 w-[120px]' />
							<Skeleton className='h-9 w-[100px]' />
						</div>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							<div className='space-y-2'>
								<Skeleton className='h-4 w-[100px]' />
								<Skeleton className='h-10 w-full' />
							</div>
							<div className='space-y-2'>
								<Skeleton className='h-4 w-[100px]' />
								<Skeleton className='h-10 w-full' />
							</div>
							<div className='space-y-2'>
								<Skeleton className='h-4 w-[100px]' />
								<Skeleton className='h-10 w-full' />
							</div>
							<div className='space-y-2'>
								<Skeleton className='h-4 w-[100px]' />
								<Skeleton className='h-10 w-full' />
							</div>
							<div className='space-y-2'>
								<Skeleton className='h-4 w-[100px]' />
								<Skeleton className='h-10 w-full' />
							</div>
						</div>
					</div>
				</div>

				<div className='flex justify-between'>
					<Skeleton className='h-10 w-[120px]' />
					<Skeleton className='h-10 w-[100px]' />
				</div>
			</CardContent>
		</Card>
	)
}
