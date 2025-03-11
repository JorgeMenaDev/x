export interface TableColumn {
	name: string
	type: string
	nullable?: boolean
	defaultValue?: unknown
	isPrimary?: boolean
}

export interface TableEndpoints {
	get: string
	create: string
	update: string
	delete: string
}

export interface Table {
	name: string
	schema: string
	columns: TableColumn[]
	endpoints: TableEndpoints
}

export interface TablesResponse {
	success: boolean
	tables: Table[]
}

export interface TableDataResponse {
	data: Record<string, unknown>[]
	page: number
	limit: number
	total: number
}

export interface FilterValue {
	column: string
	operator: string
	value: unknown
}

export interface TableViewProps {
	columns: TableColumn[]
	data: Record<string, unknown>[]
	selectedRows: Set<string>
	onSelectRow: (id: string) => void
	selectAll: boolean
	onSelectAll: (checked: boolean) => void
	onUpdateRow?: (id: string, data: Record<string, unknown>) => void
}
