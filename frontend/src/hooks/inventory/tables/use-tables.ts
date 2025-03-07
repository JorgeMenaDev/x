import { useQuery } from '@tanstack/react-query'
import { getTablesRepository } from '@/db'
import { queryKeys } from '../../../lib/query-keys'
import { TablesResponse } from '../../../db/models/inventory/table'

/**
 * Hook for fetching all available tables
 */
export function useTables() {
	const tablesRepository = getTablesRepository()

	return useQuery<TablesResponse>({
		queryKey: queryKeys.inventory.tables.list(),
		queryFn: () => tablesRepository.getTables()
	})
}
