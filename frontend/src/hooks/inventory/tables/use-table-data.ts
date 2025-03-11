import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createTablesRepository } from '../../../db/repositories'
import { FilterValue } from '../../../db/repositories/inventory/tables-repository'
import { TableRecord } from '../../../db/models/inventory/table'
import { toast } from 'sonner'

/**
 * Hook for fetching data from a specific table with support for pagination, filtering, and pausing
 * @param tableName The name of the table to fetch data from
 * @param params Optional parameters for pagination, filtering, and pausing
 */
export function useTableData<T = TableRecord>(
	tableName: string,
	params?: {
		page?: number
		limit?: number
		filters?: Record<string, FilterValue>
		pause?: boolean
	}
) {
	const tablesRepository = createTablesRepository()
	const { page = 1, limit = 10, filters = {}, pause = false } = params || {}

	return useQuery({
		queryKey: ['tableData', tableName, page, limit, filters, pause],
		queryFn: () => tablesRepository.getTableData<T>(tableName, { page, limit, filters, pause }),
		enabled: !!tableName && !pause,
		staleTime: 60 * 1000, // 1 minute,

		select: data => {
			return {
				...data,
				data: data.data.map(row => {
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					const { created_at, updated_at, ...rest } = row as Record<string, unknown>

					return { ...rest }
				})
			}
		}
	})
}

/**
 * Hook for creating a new table row
 */
export function useCreateTableRow<T = TableRecord>(tableName: string, options?: { showSuccessToast?: boolean }) {
	const queryClient = useQueryClient()
	const tablesRepository = createTablesRepository()

	return useMutation({
		mutationFn: async ({ data, id }: { data: Record<string, FilterValue | unknown>; id?: string }) => {
			return tablesRepository.createTableRow<T>(tableName, data, id)
		},
		onSuccess: () => {
			// Invalidate queries
			queryClient.invalidateQueries({
				queryKey: ['tableData', tableName]
			})

			// Show success toast if enabled
			if (options?.showSuccessToast) {
				toast.success('Row inserted successfully')
			}
		}
	})
}

/**
 * Hook for updating an existing table row
 */
export function useUpdateTableRow<T = TableRecord>(tableName: string, options?: { showSuccessToast?: boolean }) {
	const queryClient = useQueryClient()
	const tablesRepository = createTablesRepository()

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: Record<string, FilterValue | unknown> }) => {
			return tablesRepository.updateTableRow<T>(tableName, id, data)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['tableData', tableName]
			})

			// Show success toast if enabled
			if (options?.showSuccessToast) {
				toast.success('Row updated successfully')
			}
		}
	})
}

/**
 * Hook for deleting a table row
 */
export function useDeleteTableRow(tableName: string, options?: { showSuccessToast?: boolean }) {
	const queryClient = useQueryClient()
	const tablesRepository = createTablesRepository()

	return useMutation({
		mutationFn: (id: string) => tablesRepository.deleteTableRow(tableName, id),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['tableData', tableName]
			})

			// Show success toast if enabled
			if (options?.showSuccessToast) {
				toast.success('Row deleted successfully')
			}
		}
	})
}
