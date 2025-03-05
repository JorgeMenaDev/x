'use client'

import { useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { TableView } from './components/TableView'
import { TableToolbar } from './components/TableToolbar'
import { TablePagination } from './components/TablePagination'
import { MOCK_TABLES, TableData } from './types'

export function TableEditor() {
	const [selectedSchema] = useState('public')
	const [selectedTable, setSelectedTable] = useState('quotes')
	const [tables] = useState<string[]>(['quotes', 'qm_purpose'])
	const [searchQuery, setSearchQuery] = useState('')
	const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
	const [selectAll, setSelectAll] = useState(false)
	const [currentPage, setCurrentPage] = useState(1)
	const [rowsPerPage] = useState(100)
	const [tableData, setTableData] = useState(MOCK_TABLES)

	// Get current table data
	const currentTableData = tableData[selectedTable as keyof typeof tableData]
	const totalRecords = currentTableData.data.length

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
		setTableData(prev => ({
			...prev,
			[selectedTable]: {
				...prev[selectedTable as keyof typeof prev],
				data: [...prev[selectedTable as keyof typeof prev].data, data]
			}
		}))
	}

	return (
		<div className='flex flex-col h-screen'>
			<div className='border-b'>
				<h1 className='p-4 text-lg font-medium'>Table Editor</h1>
			</div>

			<div className='flex flex-1 overflow-hidden'>
				<Sidebar
					selectedSchema={selectedSchema}
					selectedTable={selectedTable}
					tables={tables}
					onTableSelect={setSelectedTable}
					searchQuery={searchQuery}
					onSearchChange={setSearchQuery}
				/>

				<div className='flex-1 flex flex-col overflow-hidden'>
					<TableToolbar
						selectedTable={selectedTable}
						columns={currentTableData.columns}
						onInsertRow={handleInsertRow}
					/>

					<TableView
						columns={currentTableData.columns}
						data={currentTableData.data}
						selectedRows={selectedRows}
						onSelectRow={handleSelectRow}
						selectAll={selectAll}
						onSelectAll={handleSelectAll}
					/>

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
