'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from './components/table-sidebar'
import { TableView } from './components/table-view'
import { TableToolbar } from './components/TableToolbar'
import { TablePagination } from './components/table-pagination'
import { useTables } from '../../api/get-tables'
import { useTableData } from '../../api/get-table-data'
import { useCreateTableRow } from '../../api/create-table-row'
import { useUpdateTableRow } from '../../api/update-table-row'
import { useDeleteTableRow } from '../../api/delete-table-row'
import { handleAPIError } from '@/lib/errors'
import { TableColumn } from './types'
import { useNotifications } from '@/components/notifications/notifications-store'

export function TableEditor() {
	const [selectedSchema] = useState('public')
	const [selectedTable, setSelectedTable] = useState<string>('')
	const [currentPage, setCurrentPage] = useState(1)
	const [rowsPerPage] = useState(10)

	// Fetch tables metadata from the API
	const { data: tablesResponse, isLoading: isLoadingTables } = useTables({})

	// Get the selected table's metadata
	const selectedTableMetadata = tablesResponse?.tables?.find(
		t => t.schema === selectedSchema && t.name === selectedTable
	)

	// Get columns from the table metadata
	// Add UI-specific column properties
	const tableColumns: TableColumn[] = selectedTableMetadata?.columns
		.map(col => {
			if (col.name === 'created_at' || col.name === 'updated_at') {
				return null
			}
			return col
		})
		.filter(Boolean) as TableColumn[]

	// Fetch data for the selected table
	const {
		data: tableDataResponse,
		isLoading: isLoadingTableData,
		error: tableDataError
	} = useTableData({
		tableName: selectedTable,
		page: currentPage,
		limit: rowsPerPage,
		pause: !selectedTable
	})

	// Mutations for table operations
	const createRow = useCreateTableRow({
		tableName: selectedTable,
		mutationConfig: {
			onSuccess: () => {
				useNotifications.getState().addNotification({
					title: 'Row created successfully',
					type: 'success',
					message: 'The row has been created successfully'
				})
			}
		}
	})

	const updateRow = useUpdateTableRow({
		tableName: selectedTable
	})

	const deleteRow = useDeleteTableRow({
		tableName: selectedTable
	})

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
			// Find the primary key column
			const primaryKeyColumn = tableColumns.find(col => col.isPrimary)?.name || 'id'
			const allIds = (tableDataResponse?.data || []).map(row => String(row[primaryKeyColumn]))
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

	const handleInsertRow = async (data: Record<string, unknown>) => {
		try {
			// FIXME: I don't think we need this -> Convert unknown values to strings
			// const stringData = Object.fromEntries(Object.entries(data).map(([key, value]) => [key, String(value)]))

			await createRow.mutateAsync({ tableName: selectedTable, data })
		} catch (error) {
			handleAPIError(error)
			throw error // Re-throw to prevent drawer from closing
		}
	}

	const handleUpdateRow = async (id: string, data: Record<string, unknown>) => {
		try {
			// Convert unknown values to strings
			const stringData = Object.fromEntries(Object.entries(data).map(([key, value]) => [key, String(value)]))

			await updateRow.mutateAsync({
				tableName: selectedTable,
				id,
				data: stringData
			})
		} catch (error) {
			console.error('Update error:', error)
			// TODO: in theory api-client.ts should handle this
			handleAPIError(error)
		}
	}

	const handleDeleteRows = async (ids: string[]) => {
		console.log('Deleting rows:', ids)
		try {
			await Promise.all(ids.map(id => deleteRow.mutateAsync({ tableName: selectedTable, id })))
			setSelectedRows(new Set())
			setSelectAll(false)
		} catch (error) {
			handleAPIError(error)
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
