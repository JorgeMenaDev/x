// Types for table data and configuration
export type TableColumn = {
	name: string
	type: string
	sortable: boolean
}

export type TableData = {
	id: string // Ensure id is always a string
	[key: string]: string | number | boolean | null
}

export type EditingCell = {
	rowId: string
	columnName: string
	value: string
} | null

// Mock data for different tables
export const MOCK_TABLES = {
	quotes: {
		columns: [
			{ name: 'id', type: 'uuid', sortable: true },
			{ name: 'created_at', type: 'timestamp', sortable: true },
			{ name: 'total_amount', type: 'int4', sortable: true },
			{ name: 'exact_matches', type: 'int4', sortable: true },
			{ name: 'similar_matches', type: 'int4', sortable: true },
			{ name: 'no_matches', type: 'int4', sortable: true },
			{ name: 'file_url', type: 'text', sortable: true }
		],
		data: [
			{
				id: '0e7b2b60-370c-414f-8ff3-7f09acb9c15b',
				created_at: '2025-03-05 08:12:04.697987+00',
				total_amount: 25540,
				exact_matches: 2,
				similar_matches: 19,
				no_matches: 0,
				file_url: 'https://xxflsmtjt'
			},
			{
				id: '1ef77c69-bdd5-4e5a-aef3-33458c1304d9',
				created_at: '2025-03-05 08:03:21.088476+00',
				total_amount: 27530,
				exact_matches: 2,
				similar_matches: 19,
				no_matches: 0,
				file_url: 'https://xxflsmtjt'
			}
		]
	},
	qm_purpose: {
		columns: [
			{ name: 'id', type: 'uuid', sortable: true },
			{ name: 'text', type: 'text', sortable: true }
		],
		data: [
			{
				id: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
				text: 'Risk Management'
			},
			{
				id: '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
				text: 'Portfolio Optimization'
			}
		]
	}
}

// Props types for components
export interface SidebarProps {
	selectedSchema: string
	selectedTable: string
	tables: string[]
	onTableSelect: (table: string) => void
	searchQuery: string
	onSearchChange: (query: string) => void
}

export interface TableViewProps {
	columns: TableColumn[]
	data: TableData[]
	selectedRows: Set<string>
	onSelectRow: (id: string) => void
	selectAll: boolean
	onSelectAll: () => void
	onCellEdit?: (rowId: string, columnName: string, value: string | null) => void
}

export interface TableToolbarProps {
	selectedTable: string
	columns: TableColumn[]
	onInsertRow: (data: TableData) => void
}

export interface TablePaginationProps {
	currentPage: number
	totalRecords: number
	rowsPerPage: number
	onPageChange: (page: number) => void
}
