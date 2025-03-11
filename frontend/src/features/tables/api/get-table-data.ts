import { queryOptions, useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { QueryConfig } from '@/lib/react-query'
import { TableDataResponse, FilterValue } from '../types'

interface GetTableDataParams {
	tableName: string
	page: number
	limit: number
	filters?: Record<string, FilterValue>
	pause?: boolean
}

export const getTableData = async ({
	tableName,
	page,
	limit,
	filters = {}
}: GetTableDataParams): Promise<TableDataResponse> => {
	return api.get(`/api/v1/inventory/data/${tableName}`, {
		params: {
			page,
			limit,
			filters: JSON.stringify(filters)
		}
	})
}

export const getTableDataQueryOptions = ({
	tableName,
	page,
	limit,
	filters = {},
	pause = false
}: GetTableDataParams) => {
	return queryOptions({
		queryKey: ['table', tableName, { page, limit, filters }],
		queryFn: () => getTableData({ tableName, page, limit, filters }),
		enabled: !pause
	})
}

type UseTableDataOptions = {
	tableName: string
	page: number
	limit: number
	filters?: Record<string, FilterValue>
	pause?: boolean
	queryConfig?: QueryConfig<typeof getTableDataQueryOptions>
}

export const useTableData = ({ tableName, page, limit, filters, pause, queryConfig }: UseTableDataOptions) => {
	return useQuery({
		...getTableDataQueryOptions({ tableName, page, limit, filters, pause }),
		...queryConfig
	})
}
