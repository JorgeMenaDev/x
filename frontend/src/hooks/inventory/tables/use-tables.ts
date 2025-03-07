import { useQuery } from '@tanstack/react-query'
import { createTablesRepository } from '../../../db/repositories'
import { queryKeys } from '../../../lib/query-keys'
import { TablesResponse } from '../../../db/models/inventory/table'

/**
 * Hook for fetching all available tables
 */
export function useTables() {
	const tablesRepository = createTablesRepository()

	return useQuery<TablesResponse>({
		queryKey: queryKeys.inventory.tables.list(),
		queryFn: () => tablesRepository.getTables()
	})
}
