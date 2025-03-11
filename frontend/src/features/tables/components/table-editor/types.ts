// import { TableColumn as BaseTableColumn, TableRecord } from '../../db/models/inventory/table'

import { Table } from '../../types'

interface BaseTableColumn {
	name: string
	type: string
	nullable: boolean
	isPrimary: boolean
}

/**
 * Generic table record type
 */
export type TableRecord = {
	[key: string]: unknown
}

/**
 * Extends the base table column with UI-specific properties
 */
export interface TableColumn extends BaseTableColumn {
	sortable?: boolean
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

/**
 * Props for the TableView component
 */
export interface TableViewProps {
	columns: TableColumn[]
	data: TableRecord[]
	selectedRows: Set<string>
	onSelectRow: (id: string) => void
	selectAll: boolean
	onSelectAll: () => void
	onUpdateRow?: (id: string, data: TableRecord) => void
}

/**
 * Props for the TableToolbar component
 */
export interface TableToolbarProps {
	selectedTable: string
	columns: TableColumn[]
	selectedRows: Set<string>
	onInsertRow: (data: TableRecord) => void
	onDeleteRows: (ids: string[]) => void
}

/**
 * Props for the TablePagination component
 */
export interface TablePaginationProps {
	currentPage: number
	totalRecords: number
	rowsPerPage: number
	onPageChange: (page: number) => void
}

/**
 * Props for the Sidebar component
 */
export interface SidebarProps {
	selectedSchema: string
	selectedTable: string
	tables: { name: string; schema: string }[]
	onTableSelect: (table: string) => void
	searchQuery: string
	onSearchChange: (query: string) => void
	isLoading: boolean
}
