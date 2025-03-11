import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { MutationConfig } from '@/lib/react-query'
import { TableRecord } from '../types'
import { getTableDataQueryOptions } from './get-table-data'

export interface CreateTableRowData {
	data: Record<string, string>
}

export const createTableRow = async ({
	tableName,
	data
}: {
	tableName: string
	data: Record<string, string>
}): Promise<TableRecord> => {
	return api.post(`/api/tables/${tableName}/rows`, data)
}

type UseCreateTableRowOptions = {
	tableName: string
	mutationConfig?: MutationConfig<typeof createTableRow>
}

export const useCreateTableRow = ({ tableName, mutationConfig }: UseCreateTableRowOptions) => {
	const queryClient = useQueryClient()

	const { onSuccess, ...restConfig } = mutationConfig || {}

	return useMutation({
		onSuccess: (...args) => {
			queryClient.invalidateQueries({
				queryKey: getTableDataQueryOptions({ tableName, page: 1, limit: 10 }).queryKey
			})
			onSuccess?.(...args)
		},
		...restConfig,
		mutationFn: (data: CreateTableRowData) => createTableRow({ tableName, ...data })
	})
}
