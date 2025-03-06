/**
 * Centralized query keys for React Query
 * This helps maintain consistency and enables proper cache invalidation
 */
export const queryKeys = {
	inventory: {
		all: ['inventory'] as const,
		tables: {
			all: ['inventory', 'tables'] as const,
			list: () => [...queryKeys.inventory.tables.all, 'list'] as const,
			qmPurpose: {
				all: ['inventory', 'tables', 'qm_purpose'] as const,
				list: (page: number, limit: number) =>
					[...queryKeys.inventory.tables.qmPurpose.all, 'list', { page, limit }] as const,
				detail: (id: string) => [...queryKeys.inventory.tables.qmPurpose.all, 'detail', id] as const
			}
		}
	},
	tables: {
		all: (tableName: string) => ['tables', tableName] as const,
		records: (tableName: string, page: number, limit: number) =>
			[...queryKeys.tables.all(tableName), 'records', { page, limit }] as const,
		record: (tableName: string, id: string) => [...queryKeys.tables.all(tableName), 'record', id] as const
	}
}
