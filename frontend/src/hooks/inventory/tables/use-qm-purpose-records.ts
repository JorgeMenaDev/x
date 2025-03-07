import { QmPurpose } from '../../../models/inventory/table'
import { useTableData } from './use-table-data'

/**
 * Hook for fetching QM purpose records with pagination
 * @deprecated Use useQmPurposeData from use-qm-purpose.ts instead
 */
export function useQmPurposeRecords(page: number = 1, limit: number = 10) {
	return useTableData<QmPurpose>('qm_purpose', { page, limit })
}
