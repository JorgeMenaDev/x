'use client'

import { useState } from 'react'
import {
	useTableData,
	useCreateTableRow,
	useUpdateTableRow,
	useDeleteTableRow
} from '@/hooks/inventory/tables/use-table-data'
import { TableRecord } from '@/models/inventory/table'
import { FilterValue } from '@/repositories/inventory/tables-repository'

interface TableEditorProps {
	tableName: string
	initialPage?: number
	initialLimit?: number
}

export function TableEditor({ tableName, initialPage = 1, initialLimit = 10 }: TableEditorProps) {
	const [page, setPage] = useState(initialPage)
	const [limit, setLimit] = useState(initialLimit)
	const [filters, setFilters] = useState<Record<string, FilterValue>>({})
	const [pause, setPause] = useState(false)
	const [newRowData, setNewRowData] = useState<Record<string, string>>({})
	const [editingRow, setEditingRow] = useState<{ id: string; data: Record<string, string> } | null>(null)

	// Fetch table data with pagination, filtering, and pausing support
	const { data, isLoading, error } = useTableData(tableName, { page, limit, filters, pause })

	// Mutations for creating, updating, and deleting rows
	const createRow = useCreateTableRow(tableName, { showSuccessToast: true })
	const updateRow = useUpdateTableRow(tableName, { showSuccessToast: true })
	const deleteRow = useDeleteTableRow(tableName, { showSuccessToast: true })

	// Handle pagination
	const handlePrevPage = () => {
		if (page > 1) setPage(page - 1)
	}

	const handleNextPage = () => {
		if (data && page < Math.ceil(data.total / limit)) {
			setPage(page + 1)
		}
	}

	// Handle pausing/resuming real-time updates
	const togglePause = () => {
		setPause(!pause)
	}

	// Handle creating a new row
	const handleCreateRow = () => {
		createRow.mutate({ data: newRowData })
		setNewRowData({})
	}

	// Handle updating a row
	const handleUpdateRow = () => {
		if (editingRow) {
			updateRow.mutate({ id: editingRow.id, data: editingRow.data })
			setEditingRow(null)
		}
	}

	// Handle deleting a row
	const handleDeleteRow = (id: string) => {
		if (confirm('Are you sure you want to delete this row?')) {
			deleteRow.mutate(id)
		}
	}

	// Handle editing a row
	const startEditing = (row: TableRecord) => {
		if (typeof row.id === 'string') {
			const editData: Record<string, string> = {}

			// Convert all values to strings for editing
			Object.entries(row).forEach(([key, value]) => {
				if (key !== 'id') {
					editData[key] = String(value ?? '')
				}
			})

			setEditingRow({ id: row.id, data: editData })
		}
	}

	// Handle filter changes
	const handleFilterChange = (key: string, value: string) => {
		if (value) {
			setFilters({ ...filters, [key]: value })
		} else {
			const newFilters = { ...filters }
			delete newFilters[key]
			setFilters(newFilters)
		}
		// Reset to first page when filters change
		setPage(1)
	}

	if (isLoading) return <div className='p-4'>Loading...</div>
	if (error) return <div className='p-4 text-red-500'>Error: {(error as Error).message}</div>
	if (!data) return <div className='p-4'>No data available</div>

	// Get column names from the first row or an empty array if no data
	const columns = data.data.length > 0 ? Object.keys(data.data[0]).filter(col => col !== 'id') : []

	return (
		<div className='p-4'>
			<div className='flex justify-between items-center mb-4'>
				<h1 className='text-2xl font-bold'>{tableName} Table</h1>
				<button
					onClick={togglePause}
					className={`px-4 py-2 rounded ${pause ? 'bg-green-500' : 'bg-red-500'} text-white`}
				>
					{pause ? 'Resume Updates' : 'Pause Updates'}
				</button>
			</div>

			{/* Filters */}
			<div className='mb-4 p-4 border rounded'>
				<h2 className='text-lg font-semibold mb-2'>Filters</h2>
				<div className='grid grid-cols-3 gap-4'>
					{columns.map(column => (
						<div key={`filter-${column}`}>
							<label className='block text-sm font-medium mb-1'>{column}</label>
							<input
								type='text'
								value={(filters[column] as string) || ''}
								onChange={e => handleFilterChange(column, e.target.value)}
								className='w-full p-2 border rounded'
								placeholder={`Filter by ${column}`}
							/>
						</div>
					))}
				</div>
			</div>

			{/* New Row Form */}
			<div className='mb-4 p-4 border rounded'>
				<h2 className='text-lg font-semibold mb-2'>Add New Row</h2>
				<div className='grid grid-cols-3 gap-4'>
					{columns.map(column => (
						<div key={`new-${column}`}>
							<label className='block text-sm font-medium mb-1'>{column}</label>
							<input
								type='text'
								value={newRowData[column] || ''}
								onChange={e => setNewRowData({ ...newRowData, [column]: e.target.value })}
								className='w-full p-2 border rounded'
								placeholder={`Enter ${column}`}
							/>
						</div>
					))}
				</div>
				<button
					onClick={handleCreateRow}
					disabled={createRow.isPending}
					className='mt-4 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300'
				>
					{createRow.isPending ? 'Adding...' : 'Add Row'}
				</button>
			</div>

			{/* Data Table */}
			<div className='overflow-x-auto'>
				<table className='min-w-full bg-white border'>
					<thead>
						<tr className='bg-gray-100'>
							<th className='p-2 border'>ID</th>
							{columns.map(column => (
								<th key={column} className='p-2 border'>
									{column}
								</th>
							))}
							<th className='p-2 border'>Actions</th>
						</tr>
					</thead>
					<tbody>
						{data.data.map((row: TableRecord) => (
							<tr key={String(row.id)} className='hover:bg-gray-50'>
								<td className='p-2 border'>{String(row.id)}</td>
								{columns.map(column => (
									<td key={`${row.id}-${column}`} className='p-2 border'>
										{editingRow && editingRow.id === row.id ? (
											<input
												type='text'
												value={editingRow.data[column] || ''}
												onChange={e =>
													setEditingRow({
														...editingRow,
														data: { ...editingRow.data, [column]: e.target.value }
													})
												}
												className='w-full p-1 border'
											/>
										) : (
											String(row[column] ?? '')
										)}
									</td>
								))}
								<td className='p-2 border'>
									{editingRow && editingRow.id === row.id ? (
										<div className='flex space-x-2'>
											<button
												onClick={handleUpdateRow}
												disabled={updateRow.isPending}
												className='px-2 py-1 bg-green-500 text-white rounded text-sm disabled:bg-green-300'
											>
												Save
											</button>
											<button
												onClick={() => setEditingRow(null)}
												className='px-2 py-1 bg-gray-500 text-white rounded text-sm'
											>
												Cancel
											</button>
										</div>
									) : (
										<div className='flex space-x-2'>
											<button
												onClick={() => startEditing(row)}
												className='px-2 py-1 bg-blue-500 text-white rounded text-sm'
											>
												Edit
											</button>
											<button
												onClick={() => handleDeleteRow(String(row.id))}
												disabled={deleteRow.isPending}
												className='px-2 py-1 bg-red-500 text-white rounded text-sm disabled:bg-red-300'
											>
												Delete
											</button>
										</div>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Pagination */}
			<div className='mt-4 flex justify-between items-center'>
				<div>
					Showing {data.data.length} of {data.total} records
				</div>
				<div className='flex space-x-2'>
					<button
						onClick={handlePrevPage}
						disabled={page <= 1}
						className='px-4 py-2 bg-gray-200 rounded disabled:bg-gray-100 disabled:text-gray-400'
					>
						Previous
					</button>
					<span className='px-4 py-2'>
						Page {page} of {Math.max(1, Math.ceil(data.total / limit))}
					</span>
					<button
						onClick={handleNextPage}
						disabled={page >= Math.ceil(data.total / limit)}
						className='px-4 py-2 bg-gray-200 rounded disabled:bg-gray-100 disabled:text-gray-400'
					>
						Next
					</button>
				</div>
				<div className='flex items-center space-x-2'>
					<label className='text-sm'>Rows per page:</label>
					<select
						value={limit}
						onChange={e => {
							setLimit(Number(e.target.value))
							setPage(1) // Reset to first page when limit changes
						}}
						className='p-2 border rounded'
					>
						<option value={5}>5</option>
						<option value={10}>10</option>
						<option value={25}>25</option>
						<option value={50}>50</option>
						<option value={100}>100</option>
					</select>
				</div>
			</div>
		</div>
	)
}
