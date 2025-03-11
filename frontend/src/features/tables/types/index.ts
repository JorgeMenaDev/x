export interface TableColumn {
	name: string
	type: string
	nullable?: boolean
	defaultValue?: unknown
	isPrimary?: boolean
}

export interface TableRecord {
	id: string
	[key: string]: unknown
}

export interface TablesResponse {
	tables: string[]
}

export interface TableDataResponse {
	data: TableRecord[]
	total: number
	columns: TableColumn[]
}

export interface FilterValue {
	column: string
	operator: string
	value: unknown
}

export interface TableViewProps {
	columns: TableColumn[]
	data: TableRecord[]
	selectedRows: Set<string>
	onSelectRow: (id: string) => void
	selectAll: boolean
	onSelectAll: (checked: boolean) => void
	onUpdateRow?: (id: string, data: Record<string, unknown>) => void
}
