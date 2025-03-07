import { QmPurpose } from '../../../models/inventory/table'
import { useTableData, useCreateTableRow, useUpdateTableRow, useDeleteTableRow } from './use-table-data'

const TABLE_NAME = 'qm_purpose'

/**
 * Hook for fetching QM purpose records with pagination
 */
export function useQmPurposeData(params?: { page?: number; limit?: number; pause?: boolean }) {
	return useTableData<QmPurpose>(TABLE_NAME, params)
}

/**
 * Hook for creating a new QM purpose record
 */
export function useCreateQmPurpose() {
	const createRow = useCreateTableRow<QmPurpose>(TABLE_NAME, { showSuccessToast: true })

	return {
		createQmPurpose: (text: string) => {
			return createRow.mutate({
				data: { text }
			})
		},
		isLoading: createRow.isPending,
		error: createRow.error
	}
}

/**
 * Hook for updating a QM purpose record
 */
export function useUpdateQmPurpose() {
	const updateRow = useUpdateTableRow<QmPurpose>(TABLE_NAME, { showSuccessToast: true })

	return {
		updateQmPurpose: (id: string, text: string) => {
			return updateRow.mutate({
				id,
				data: { text }
			})
		},
		isLoading: updateRow.isPending,
		error: updateRow.error
	}
}

/**
 * Hook for deleting a QM purpose record
 */
export function useDeleteQmPurpose() {
	const deleteRow = useDeleteTableRow(TABLE_NAME, { showSuccessToast: true })

	return {
		deleteQmPurpose: (id: string) => {
			return deleteRow.mutate(id)
		},
		isLoading: deleteRow.isPending,
		error: deleteRow.error
	}
}
