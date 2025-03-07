import { useQuery } from '@tanstack/react-query'
import { createTablesRepository } from '../../../repositories'

/**
 * Hook for fetching all available tables with their metadata
 */
export function useTables() {
	const tablesRepository = createTablesRepository()

	return useQuery({
		queryKey: ['tables'],
		queryFn: () => tablesRepository.getTables()
	})
}
