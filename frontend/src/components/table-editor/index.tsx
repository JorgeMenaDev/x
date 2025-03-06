'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from './components/Sidebar'
import { TableView } from './components/TableView'
import { TableToolbar } from './components/TableToolbar'
import { TablePagination } from './components/TablePagination'
import { MOCK_TABLES, TableData, TableColumn } from './types'
import { useTables } from '../../hooks/inventory/tables/use-tables'
import { useTableData } from '../../hooks/inventory/tables/use-table-data'
import { QmPurpose } from '../../models/inventory/table'

export function TableEditor() {
	const [selectedSchema] = useState('public')
	const [selectedTable, setSelectedTable] = useState('qm_purpose') // Default to qm_purpose since it's implemented
	const [currentPage, setCurrentPage] = useState(1)
	const [rowsPerPage] = useState(10)

	// Fetch tables from the API
	const { data: tablesResponse, isLoading: isLoadingTables } = useTables()

	// Use the fetched tables if available, otherwise fall back to the hardcoded list
	const tables = tablesResponse?.tables.map(table => table.name) || [
		'qm_purpose',
		'extracted_products',
		'inventory',
		'matched_products',
		'offices',
		'price_lists',
		'product_embeddings',
		'product_types',
		'products',
		'quotes',
		'variants'
	]

	// Fetch data for the selected table
	const {
		data: tableDataResponse,
		isLoading: isLoadingTableData,
		error: tableDataError
	} = useTableData(selectedTable, currentPage, rowsPerPage)

	const [searchQuery, setSearchQuery] = useState('')
	const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
	const [selectAll, setSelectAll] = useState(false)
	const [tableData, setTableData] = useState(MOCK_TABLES)

	// Update the table data when the API response changes
	useEffect(() => {
		if (tableDataResponse && selectedTable === 'qm_purpose') {
			// Convert the API response to the format expected by the TableView component
			const columns: TableColumn[] = [
				{ name: 'id', type: 'uuid', sortable: true },
				{ name: 'text', type: 'text', sortable: true },
				{ name: 'created_at', type: 'timestamp', sortable: true },
				{ name: 'updated_at', type: 'timestamp', sortable: true }
			]

			const data = tableDataResponse.data.map((record: QmPurpose) => ({
				id: record.id,
				text: record.text,
				created_at: record.created_at,
				updated_at: record.updated_at
			}))

			// Update the tableData state with the new data
			setTableData(prev => ({
				...prev,
				qm_purpose: {
					columns,
					data
				}
			}))
		}
	}, [tableDataResponse, selectedTable])

	// Reset selected rows when changing tables
	useEffect(() => {
		setSelectedRows(new Set())
		setSelectAll(false)
	}, [selectedTable])

	// Get current table data
	const currentTableData = tableData[selectedTable as keyof typeof tableData] || { columns: [], data: [] }
	const totalRecords =
		selectedTable === 'qm_purpose' && tableDataResponse ? tableDataResponse.total : currentTableData.data.length

	const handleSelectAll = () => {
		if (selectAll) {
			setSelectedRows(new Set())
		} else {
			const allIds = currentTableData.data.map(row => row.id)
			setSelectedRows(new Set(allIds))
		}
		setSelectAll(!selectAll)
	}

	const handleSelectRow = (id: string) => {
		const newSelectedRows = new Set(selectedRows)
		if (newSelectedRows.has(id)) {
			newSelectedRows.delete(id)
		} else {
			newSelectedRows.add(id)
		}
		setSelectedRows(newSelectedRows)
		setSelectAll(newSelectedRows.size === currentTableData.data.length)
	}

	const handleInsertRow = (data: TableData) => {
		// For now, just update the local state
		// In a real implementation, this would call an API endpoint
		setTableData(prev => ({
			...prev,
			[selectedTable]: {
				...prev[selectedTable as keyof typeof prev],
				data: [...prev[selectedTable as keyof typeof prev].data, data]
			}
		}))
	}

	const handleDeleteRows = (ids: string[]) => {
		// For now, just update the local state
		// In a real implementation, this would call an API endpoint
		setTableData(prev => ({
			...prev,
			[selectedTable]: {
				...prev[selectedTable as keyof typeof prev],
				data: prev[selectedTable as keyof typeof prev].data.filter(row => !ids.includes(row.id))
			}
		}))
		// Clear selected rows after deletion
		setSelectedRows(new Set())
		setSelectAll(false)
	}

	return (
		<div className='flex flex-col h-screen'>
			<div className='flex flex-1 overflow-hidden'>
				<Sidebar
					selectedSchema={selectedSchema}
					selectedTable={selectedTable}
					tables={tables}
					onTableSelect={setSelectedTable}
					searchQuery={searchQuery}
					onSearchChange={setSearchQuery}
					isLoading={isLoadingTables}
				/>

				<div className='flex-1 flex flex-col overflow-hidden'>
					<TableToolbar
						selectedTable={selectedTable}
						columns={currentTableData.columns}
						onInsertRow={handleInsertRow}
						selectedRows={selectedRows}
						onDeleteRows={handleDeleteRows}
					/>

					{isLoadingTableData ? (
						<div className='flex-1 flex items-center justify-center'>
							<div className='text-center'>
								<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto'></div>
								<p className='mt-2'>Loading table data...</p>
							</div>
						</div>
					) : tableDataError ? (
						<div className='flex-1 flex items-center justify-center'>
							<div className='text-center text-red-500'>
								<p>Error loading table data.</p>
								<p className='text-sm'>{(tableDataError as Error).message}</p>
							</div>
						</div>
					) : (
						<TableView
							columns={currentTableData.columns}
							data={currentTableData.data}
							selectedRows={selectedRows}
							onSelectRow={handleSelectRow}
							selectAll={selectAll}
							onSelectAll={handleSelectAll}
						/>
					)}

					<TablePagination
						currentPage={currentPage}
						totalRecords={totalRecords}
						rowsPerPage={rowsPerPage}
						onPageChange={setCurrentPage}
					/>
				</div>
			</div>
		</div>
	)
}
