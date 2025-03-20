'use client'

import * as React from 'react'
import { columns } from './columns'
import { modelData, filterFields } from './constants'
import { DataTable } from '@/features/default-table/data-table'
import { Skeleton } from '@/features/default-table/skeleton'
import { useQueryStates } from 'nuqs'
import { searchParamsParser } from './search-params'

export function ModelExplorer() {
	// Use query states to manage filter state in URL
	const [queryState, setQueryState] = useQueryStates(searchParamsParser, {
		history: 'push'
	})

	// Create column filters from query params
	const defaultColumnFilters = React.useMemo(() => {
		return Object.entries(queryState)
			.filter(([_, value]) => {
				if (Array.isArray(value)) return value.length > 0
				return !!value
			})
			.map(([key, value]) => ({
				id: key,
				value
			}))
	}, [queryState])

	return (
		<div className='container mx-auto py-6'>
			<h1 className='text-3xl font-bold mb-6'>Model Inventory Explorer</h1>

			<React.Suspense fallback={<Skeleton />}>
				<DataTable
					columns={columns as any}
					data={modelData as any}
					filterFields={filterFields as any}
					defaultColumnFilters={defaultColumnFilters}
				/>
			</React.Suspense>
		</div>
	)
}
