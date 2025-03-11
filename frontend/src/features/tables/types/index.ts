export interface TableColumn {
	name: string
	type: string
	nullable?: boolean
	defaultValue?: any
}

export interface TableRecord {
	id: number
	[key: string]: any
}

export interface TablesResponse {
	tables: string[]
}

export interface TableDataResponse {
	columns: TableColumn[]
	records: TableRecord[]
}

export interface FilterValue {
	column: string
	operator: string
	value: any
}
