import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { MutationConfig } from '@/lib/react-query'
import { TableRecord } from '../components/table-editor/types'
import { getTableDataQueryOptions } from './get-table-data'

export type UpdateTableRowData = {
	id: string
	data: Record<string, string>
}

type UpdateTableRowParams = {
	tableName: string
	id: string
	data: Record<string, string>
}

export const updateTableRow = async ({ tableName, id, data }: UpdateTableRowParams): Promise<TableRecord> => {
	return api.patch(`/api/v1/inventory/data/${tableName}/rows/${id}`, data)
}

type UseUpdateTableRowOptions = {
	tableName: string
	mutationConfig?: Omit<MutationConfig<typeof updateTableRow>, 'mutationFn'>
}

export const useUpdateTableRow = ({ tableName, mutationConfig }: UseUpdateTableRowOptions) => {
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
		mutationFn: ({ id, data }: UpdateTableRowData) => updateTableRow({ tableName, id, data })
	})
}
