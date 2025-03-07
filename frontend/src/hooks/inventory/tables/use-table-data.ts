import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getTablesRepository } from '@/db'
import { queryKeys } from '../../../lib/query-keys'
import { TablesRepository } from '@/db'
import { TableRecord } from '../../../db/models/inventory/table'
import { toast } from 'sonner'

/**
 * Hook for fetching data from a specific table
 * @param tableName The name of the table to fetch data from
 * @param page The page number to fetch
 * @param limit The number of records per page
 */
export function useTableData(tableName: string, page: number = 1, limit: number = 100) {
	const tablesRepository = getTablesRepository()

	return useQuery({
		queryKey: getQueryKey(tableName, page, limit),
		queryFn: () => fetchTableData(tablesRepository, tableName, page, limit),
		enabled: !!tableName
	})
}

/**
 * Helper function to get the appropriate query key based on the table name
 */
function getQueryKey(tableName: string, page: number, limit: number) {
	if (tableName === 'qm_purpose') {
		return queryKeys.inventory.tables.qmPurpose.list(page, limit)
	}

	return ['tableData', tableName, page, limit]
}

/**
 * Helper function to fetch data from the appropriate endpoint based on the table name
 */
async function fetchTableData(repository: TablesRepository, tableName: string, page: number, limit: number) {
	if (tableName === 'qm_purpose') {
		return repository.getQmPurposeRecords(page, limit)
	}

	// For other tables, we'll need to implement generic table data fetching
	// This would be expanded as more table-specific endpoints are added
	throw new Error(`Fetching data for table ${tableName} is not yet implemented`)
}

/**
 * Hook for fetching table records
 */
export function useTableRecords<T = TableRecord>(tableName: string, page: number = 1, limit: number = 100) {
	const tablesRepository = getTablesRepository()

	return useQuery({
		queryKey: queryKeys.tables.records(tableName, page, limit),
		queryFn: () => tablesRepository.getTableRecords<T>(tableName, page, limit),
		enabled: !!tableName
	})
}

/**
 * Hook for creating a new table record
 */
export function useCreateTableRecord<T = TableRecord>(tableName: string, options?: { showSuccessToast?: boolean }) {
	const queryClient = useQueryClient()
	const tablesRepository = getTablesRepository()

	return useMutation({
		mutationFn: async (data: Partial<T>) => {
			console.log('Mutation received data:', data)
			// Use the specific endpoint for qm_purpose table
			const result = await (tableName === 'qm_purpose'
				? tablesRepository.createQmPurposeRecord(data)
				: tablesRepository.createTableRecord<T>(tableName, data))
			console.log('Mutation result:', result)
			return result
		},
		onSuccess: () => {
			// Invalidate queries
			queryClient.invalidateQueries({
				queryKey: queryKeys.tables.all(tableName)
			})

			// Show success toast if enabled
			if (options?.showSuccessToast) {
				toast.success('Row inserted successfully')
			}
		}
	})
}

/**
 * Hook for updating an existing table record
 */
export function useUpdateTableRecord<T = TableRecord>(tableName: string) {
	const queryClient = useQueryClient()
	const tablesRepository = getTablesRepository()

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: Partial<T> }) => {
			// Send the data directly without nesting
			return tablesRepository.updateTableRecord<T>(tableName, id, data)
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.tables.record(tableName, variables.id)
			})
			queryClient.invalidateQueries({
				queryKey: queryKeys.tables.all(tableName)
			})
		}
	})
}

/**
 * Hook for deleting a table record
 */
export function useDeleteTableRecord(tableName: string) {
	const queryClient = useQueryClient()
	const tablesRepository = getTablesRepository()

	return useMutation({
		mutationFn: (id: string) => tablesRepository.deleteTableRecord(tableName, id),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: queryKeys.tables.all(tableName)
			})
		}
	})
}
