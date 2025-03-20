'use client'

import * as React from 'react'
import { columns } from './columns'
import { modelData, filterFields } from './constants'
import { Skeleton } from '@/features/default-table/skeleton'
import { useQueryStates } from 'nuqs'
import { searchParamsParser } from './search-params'
import { ModelDataTable } from './data-table'
import type { ColumnFiltersState } from '@tanstack/react-table'

// Create a simple wrapper component that provides just the ModelExplorer
export function ModelExplorer() {
	// We need to initialize state with defaults for the UI to work correctly
	const [queryState, setQueryState] = useQueryStates(searchParamsParser, {
		history: 'push'
	})

	// Convert query params to column filters
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

	// Handle filter changes for URL updates
	const handleFiltersChange = React.useCallback(
		(filters: ColumnFiltersState) => {
			const params: Record<string, any> = {}

			// Update with new filter values
			filters.forEach(filter => {
				params[filter.id] = filter.value
			})

			// Update URL
			setQueryState(params)
		},
		[setQueryState]
	)

	return (
		<div className='container mx-auto py-6'>
			<h1 className='text-3xl font-bold mb-6'>Model Inventory Explorer</h1>

			<React.Suspense fallback={<Skeleton />}>
				<ModelDataTable
					columns={columns as any}
					data={modelData as any}
					filterFields={filterFields as any}
					defaultColumnFilters={defaultColumnFilters}
					onFiltersChange={handleFiltersChange}
				/>
			</React.Suspense>
		</div>
	)
}
