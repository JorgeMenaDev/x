'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from './components/Sidebar'
import { TableView } from './components/TableView'
import { TableToolbar } from './components/TableToolbar'
import { TablePagination } from './components/TablePagination'
import { useTables } from '../../hooks/inventory/tables/use-tables'
import {
	useTableRecords,
	useCreateTableRecord,
	useUpdateTableRecord,
	useDeleteTableRecord
} from '../../hooks/inventory/tables/use-table-data'
import { TableRecord } from '../../models/inventory/table'
import { TableColumn } from './types'

export function TableEditor() {
	const [selectedSchema] = useState('public')
	const [selectedTable, setSelectedTable] = useState<string>('')
	const [currentPage, setCurrentPage] = useState(1)
	const [rowsPerPage] = useState(10)

	// Fetch tables metadata from the API
	const { data: tablesResponse, isLoading: isLoadingTables } = useTables()

	// Get the selected table's metadata
	const selectedTableMetadata = tablesResponse?.tables.find(t => t.name === selectedTable)

	// Add UI-specific column properties
	const tableColumns: TableColumn[] =
		selectedTableMetadata?.columns.map(col => ({
			...col,
			sortable: true // Make all columns sortable by default
		})) || []

	// Fetch data for the selected table
	const {
		data: tableDataResponse,
		isLoading: isLoadingTableData,
		error: tableDataError
	} = useTableRecords(selectedTable, currentPage, rowsPerPage)

	// Mutations for table operations
	const createRecord = useCreateTableRecord(selectedTable)
	const updateRecord = useUpdateTableRecord(selectedTable)
	const deleteRecord = useDeleteTableRecord(selectedTable)

	const [searchQuery, setSearchQuery] = useState('')
	const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
	const [selectAll, setSelectAll] = useState(false)

	// Reset selected rows when changing tables
	useEffect(() => {
		setSelectedRows(new Set())
		setSelectAll(false)
	}, [selectedTable])

	const handleSelectAll = () => {
		if (selectAll) {
			setSelectedRows(new Set())
		} else {
			const allIds = (tableDataResponse?.data || []).map(row => row.id as string)
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
		setSelectAll(newSelectedRows.size === (tableDataResponse?.data || []).length)
	}

	const handleInsertRow = async (data: TableRecord) => {
		try {
			await createRecord.mutateAsync(data)
		} catch (error) {
			console.error('Error creating record:', error)
		}
	}

	const handleUpdateRow = async (id: string, data: TableRecord) => {
		try {
			await updateRecord.mutateAsync({ id, data })
		} catch (error) {
			console.error('Error updating record:', error)
		}
	}

	const handleDeleteRows = async (ids: string[]) => {
		try {
			await Promise.all(ids.map(id => deleteRecord.mutateAsync(id)))
			setSelectedRows(new Set())
			setSelectAll(false)
		} catch (error) {
			console.error('Error deleting records:', error)
		}
	}

	return (
		<div className='flex flex-col h-screen'>
			<div className='flex flex-1 overflow-hidden'>
				<Sidebar
					selectedSchema={selectedSchema}
					selectedTable={selectedTable}
					tables={tablesResponse?.tables || []}
					onTableSelect={setSelectedTable}
					searchQuery={searchQuery}
					onSearchChange={setSearchQuery}
					isLoading={isLoadingTables}
				/>

				<div className='flex-1 flex flex-col overflow-hidden'>
					{selectedTableMetadata && (
						<TableToolbar
							selectedTable={selectedTable}
							columns={tableColumns}
							onInsertRow={handleInsertRow}
							selectedRows={selectedRows}
							onDeleteRows={handleDeleteRows}
						/>
					)}

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
					) : selectedTableMetadata ? (
						<TableView
							columns={tableColumns}
							data={tableDataResponse?.data || []}
							selectedRows={selectedRows}
							onSelectRow={handleSelectRow}
							selectAll={selectAll}
							onSelectAll={handleSelectAll}
							onUpdateRow={handleUpdateRow}
						/>
					) : (
						<div className='flex-1 flex items-center justify-center'>
							<p className='text-muted-foreground'>Select a table to view its data</p>
						</div>
					)}

					{selectedTable && tableDataResponse && (
						<TablePagination
							currentPage={currentPage}
							totalRecords={tableDataResponse.total}
							rowsPerPage={rowsPerPage}
							onPageChange={setCurrentPage}
						/>
					)}
				</div>
			</div>
		</div>
	)
}
