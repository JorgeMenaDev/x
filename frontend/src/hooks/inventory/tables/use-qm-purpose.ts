import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createTablesRepository } from '../../../repositories'
import { queryKeys } from '../../../lib/query-keys'
import { QmPurpose, QmPurposeResponse } from '../../../models/inventory/table'

/**
 * Hook for fetching qm_purpose records
 */
export function useQmPurposeRecords(page: number = 1, limit: number = 100) {
	const tablesRepository = createTablesRepository()

	return useQuery<QmPurposeResponse>({
		queryKey: queryKeys.inventory.tables.qmPurpose.list(page, limit),
		queryFn: () => tablesRepository.getQmPurposeRecords(page, limit)
	})
}

/**
 * Hook for creating a new qm_purpose record
 */
export function useCreateQmPurposeRecord() {
	const queryClient = useQueryClient()
	const tablesRepository = createTablesRepository()

	return useMutation({
		mutationFn: (data: Omit<QmPurpose, 'id' | 'created_at' | 'updated_at'>) =>
			tablesRepository.createQmPurposeRecord(data),
		onSuccess: () => {
			// Invalidate the qm_purpose list query to refetch the data
			queryClient.invalidateQueries({
				queryKey: queryKeys.inventory.tables.qmPurpose.all
			})
		}
	})
}

/**
 * Hook for updating an existing qm_purpose record
 */
export function useUpdateQmPurposeRecord() {
	const queryClient = useQueryClient()
	const tablesRepository = createTablesRepository()

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: Partial<Omit<QmPurpose, 'id' | 'created_at' | 'updated_at'>> }) =>
			tablesRepository.updateQmPurposeRecord(id, data),
		onSuccess: (_, variables) => {
			// Invalidate the specific qm_purpose record query
			queryClient.invalidateQueries({
				queryKey: queryKeys.inventory.tables.qmPurpose.detail(variables.id)
			})

			// Invalidate the qm_purpose list query
			queryClient.invalidateQueries({
				queryKey: queryKeys.inventory.tables.qmPurpose.all
			})
		}
	})
}

/**
 * Hook for deleting a qm_purpose record
 */
export function useDeleteQmPurposeRecord() {
	const queryClient = useQueryClient()
	const tablesRepository = createTablesRepository()

	return useMutation({
		mutationFn: (id: string) => tablesRepository.deleteQmPurposeRecord(id),
		onSuccess: () => {
			// Invalidate the qm_purpose list query
			queryClient.invalidateQueries({
				queryKey: queryKeys.inventory.tables.qmPurpose.all
			})
		}
	})
}
