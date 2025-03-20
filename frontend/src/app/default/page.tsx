import { columns } from '../../features/default-table/columns'
import { data, filterFields } from '../../features/default-table/constants'
import { DataTable } from '../../features/default-table/data-table'
import { searchParamsCache } from '../../features/default-table/search-params'
import { Skeleton } from '../../features/default-table/skeleton'

import * as React from 'react'

export default async function Page({
	searchParams
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
	const search = searchParamsCache.parse(await searchParams)

	return (
		<React.Suspense fallback={<Skeleton />}>
			<DataTable
				columns={columns}
				data={data}
				filterFields={filterFields}
				defaultColumnFilters={Object.entries(search)
					.map(([key, value]) => ({
						id: key,
						value
					}))
					.filter(({ value }) => value ?? undefined)}
			/>
		</React.Suspense>
	)
}
