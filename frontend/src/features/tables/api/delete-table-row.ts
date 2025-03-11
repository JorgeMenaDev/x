import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { MutationConfig } from '@/lib/react-query'
import { getTableDataQueryOptions } from './get-table-data'

export interface DeleteTableRowData {
	id: string
}

export const deleteTableRow = async ({ tableName, id }: { tableName: string; id: string }): Promise<void> => {
	return api.delete(`/api/tables/${tableName}/rows/${id}`)
}

type UseDeleteTableRowOptions = {
	tableName: string
	mutationConfig?: MutationConfig<typeof deleteTableRow>
}

export const useDeleteTableRow = ({ tableName, mutationConfig }: UseDeleteTableRowOptions) => {
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
		mutationFn: (data: DeleteTableRowData) => deleteTableRow({ tableName, ...data })
	})
}
