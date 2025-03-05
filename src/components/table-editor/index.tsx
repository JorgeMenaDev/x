'use client'

import { useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { TableView } from './components/TableView'
import { TableToolbar } from './components/TableToolbar'
import { TablePagination } from './components/TablePagination'
import { MOCK_TABLES } from './types'

export function TableEditor() {
	const [selectedSchema, setSelectedSchema] = useState('public')
	const [selectedTable, setSelectedTable] = useState('quotes')
	const [tables] = useState<string[]>(['quotes', 'qm_purpose'])
	const [searchQuery, setSearchQuery] = useState('')
	const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
	const [selectAll, setSelectAll] = useState(false)
	const [currentPage, setCurrentPage] = useState(1)
	const [rowsPerPage] = useState(100)

	// Get current table data
	const currentTableData = MOCK_TABLES[selectedTable as keyof typeof MOCK_TABLES]
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
					<TableToolbar selectedTable={selectedTable} />

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
