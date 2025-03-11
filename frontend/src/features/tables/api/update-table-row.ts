import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import { MutationConfig } from '@/lib/react-query'
import { TableRecord } from '../components/table-editor/types'
import { getTableDataQueryOptions } from './get-table-data'
import { toast } from 'sonner'

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
	if (!data || Object.keys(data).length === 0) {
		throw new Error('No data provided for update')
	}

	// Send both id and data at the top level as the backend expects
	const requestBody = {
		id, // ID at top level
		data // Data object separate from ID
	}

	return api.put(`/api/v1/inventory/data/${tableName}`, requestBody)
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

			toast.success('Success', {
				description: 'Row updated successfully'
			})

			onSuccess?.(...args)
		},
		...restConfig,
		mutationFn: ({ id, data }: UpdateTableRowData) => updateTableRow({ tableName, id, data })
	})
}
