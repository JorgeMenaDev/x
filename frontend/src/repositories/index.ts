import { HttpTablesRepository } from '../adapters/http/inventory/tables-repository'
import { TablesRepository } from './inventory/tables-repository'

// Get the API base URL from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'

console.log(API_BASE_URL)

/**
 * Factory function to create a TablesRepository instance
 */
export function createTablesRepository(): TablesRepository {
	return new HttpTablesRepository(API_BASE_URL)
}

// Export repository interfaces for type usage
export type { TablesRepository }
