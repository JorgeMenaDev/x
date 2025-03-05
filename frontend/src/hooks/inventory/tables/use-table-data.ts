import { useQuery } from '@tanstack/react-query'
import { createTablesRepository } from '../../../repositories'
import { queryKeys } from '../../../lib/query-keys'
import { TablesRepository } from '../../../repositories/inventory/tables-repository'

/**
 * Hook for fetching data from a specific table
 * @param tableName The name of the table to fetch data from
 * @param page The page number to fetch
 * @param limit The number of records per page
 */
export function useTableData(tableName: string, page: number = 1, limit: number = 100) {
	const tablesRepository = createTablesRepository()

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
