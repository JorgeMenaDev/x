import { HttpTablesRepository } from './adapters/http/inventory/tables-repository'
import { TablesRepository } from './repositories/inventory/tables-repository'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

export function getTablesRepository(): TablesRepository {
	return new HttpTablesRepository(API_BASE_URL)
}

// Export repository interfaces for type usage
export type { TablesRepository }
