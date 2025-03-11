import { queryOptions, useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { QueryConfig } from '@/lib/react-query'
import { TablesResponse } from '../types'

export const getTables = (): Promise<TablesResponse> => {
	return api.get(`/api/v1/inventory/tables`)
}

export const getTablesQueryOptions = () => {
	return queryOptions({
		queryKey: ['tables'],
		queryFn: () => getTables()
	})
}

type UseTablesOptions = {
	queryConfig?: QueryConfig<typeof getTablesQueryOptions>
}

export const useTables = ({ queryConfig }: UseTablesOptions = {}) => {
	return useQuery({
		...getTablesQueryOptions(),
		...queryConfig
	})
}
