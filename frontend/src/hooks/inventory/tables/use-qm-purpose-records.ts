import { useQuery } from '@tanstack/react-query'
import { getTablesRepository } from '@/db'
import { queryKeys } from '../../../lib/query-keys'
import { QmPurposeResponse } from '../../../db/models/inventory/table'

/**
 * Hook for fetching qm_purpose records
 * @param page The page number to fetch
 * @param limit The number of records per page
 */
export function useQmPurposeRecords(page: number = 1, limit: number = 100) {
	const tablesRepository = getTablesRepository()

	return useQuery<QmPurposeResponse>({
		queryKey: queryKeys.inventory.tables.qmPurpose.list(page, limit),
		queryFn: () => tablesRepository.getQmPurposeRecords(page, limit)
	})
}
