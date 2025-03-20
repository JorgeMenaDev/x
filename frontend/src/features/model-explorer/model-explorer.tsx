'use client'

import * as React from 'react'
import { columns } from './columns'
import { modelData, filterFields } from './constants'
import { DataTable } from '@/features/default-table/data-table'
import { searchParamsCache } from './search-params'
import { Skeleton } from '@/features/default-table/skeleton'

type SearchParamsType = { [key: string]: string | string[] | undefined }

export function ModelExplorer({ searchParams }: { searchParams: SearchParamsType | Promise<SearchParamsType> }) {
	// Handle both Promise and direct object formats
	const [parsedParams, setParsedParams] = React.useState<SearchParamsType>({})

	React.useEffect(() => {
		const parseParams = async () => {
			const resolvedParams = searchParams instanceof Promise ? await searchParams : searchParams

			const parsed = searchParamsCache.parse(resolvedParams)
			setParsedParams(parsed)
		}

		parseParams()
	}, [searchParams])

	return (
		<div className='container mx-auto py-6'>
			<h1 className='text-3xl font-bold mb-6'>Model Inventory Explorer</h1>

			<React.Suspense fallback={<Skeleton />}>
				<DataTable
					columns={columns as any}
					data={modelData as any}
					filterFields={filterFields as any}
					defaultColumnFilters={Object.entries(parsedParams)
						.map(([key, value]) => ({
							id: key,
							value
						}))
						.filter(({ value }) => value ?? undefined)}
				/>
			</React.Suspense>
		</div>
	)
}
