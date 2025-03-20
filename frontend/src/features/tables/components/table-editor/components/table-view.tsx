'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell as BaseTableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu'
import { TableCell } from './table-cell'
import { TableRecord, TableViewProps } from '../types'
import { validateField, isFieldEditable } from '@/features/default-table/lib/validation/table-schemas'
import { toast } from 'sonner'

export function TableView({
	columns,
	data,
	selectedRows,
	onSelectRow,
	selectAll,
	onSelectAll,
	onUpdateRow
}: TableViewProps) {
	// Use a string key instead of an object for more reliable comparison
	const [editingCellKey, setEditingCellKey] = useState<string | null>(null)
	const [localData, setLocalData] = useState<TableRecord[]>(data)

	// Find the primary key column
	const primaryKeyColumn = columns.find(col => col.isPrimary)?.name || 'id'

	// Update local data when prop changes
	useEffect(() => {
		setLocalData(data)
	}, [data])

	// Reset editing cell when data changes to prevent stale state
	useEffect(() => {
		setEditingCellKey(null)
	}, [data])

	const handleCellUpdate = (rowId: string, columnName: string, value: string | null) => {
		// Find the column definition
		const column = columns.find(col => col.name === columnName)
		if (!column) return

		console.log('TableView - Starting cell update with:', {
			rowId,
			columnName,
			value,
			primaryKeyColumn,
			column
		})

		// Check if the field is editable
		if (!isFieldEditable(column)) {
			toast.error('This field cannot be edited')
			setEditingCellKey(null)
			return
		}

		// Validate the new value
		const validation = validateField(value, column)
		if (!validation.success) {
			toast.error(validation.error || 'Invalid value for this field type')
			setEditingCellKey(null)
			return
		}

		// Update local state immediately for UI responsiveness
		setLocalData(prevData =>
			prevData.map(row => {
				// Get the row ID using the primary key
				const currentRowId = String(row[primaryKeyColumn] || '')
				return currentRowId === rowId ? { ...row, [columnName]: value === null ? null : value } : row
			})
		)

		// Notify parent component with the correct data structure
		if (onUpdateRow) {
			// Ensure data is not empty
			const updateData = {
				[columnName]: value === null ? null : value
			}
			console.log('TableView - Calling onUpdateRow with:', {
				rowId,
				updateData
			})
			onUpdateRow(rowId, updateData)
		}
		setEditingCellKey(null)
	}

	const startEditing = (rowId: string, columnName: string) => {
		// Find the column definition
		const column = columns.find(col => col.name === columnName)
		if (!column) return

		// Show a toast for non-editable fields but still allow clicking
		if (!isFieldEditable(column)) {
			toast.error('This field cannot be edited')
			return
		}

		// Create a unique key for this cell
		const cellKey = `${rowId}:${columnName}`
		setEditingCellKey(cellKey)
	}

	const cancelEditing = () => {
		setEditingCellKey(null)
	}

	const isEditing = (rowId: string, columnName: string) => {
		// Create the same key format for comparison
		const cellKey = `${rowId}:${columnName}`
		const result = editingCellKey === cellKey

		return result
	}

	return (
		<div className='flex-1 overflow-auto text-xs'>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className='w-[32px] p-2'>
							<Checkbox checked={selectAll} onCheckedChange={onSelectAll} />
						</TableHead>
						{columns.map(column => (
							<TableHead key={column.name}>
								<div className='flex items-center gap-1'>
									<span className='font-medium'>{column.name}</span>
									<span className='text-[10px] text-muted-foreground'>{column.type}</span>
									{column.isPrimary && <span className='text-[10px] text-muted-foreground'>(Primary Key)</span>}
								</div>
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{localData.map((row, rowIndex) => {
						// Get the row ID using the primary key
						const rowId = String(row[primaryKeyColumn] || `row-${rowIndex}`)

						return (
							<TableRow key={rowId} className='h-8'>
								<BaseTableCell className='p-2'>
									<Checkbox checked={selectedRows.has(rowId)} onCheckedChange={() => onSelectRow(rowId)} className='' />
								</BaseTableCell>
								{columns.map(column => (
									<BaseTableCell
										key={`${rowId}-${column.name}`}
										className={`p-0 ${!isFieldEditable(column) ? 'cursor-not-allowed bg-muted/30' : ''}`}
									>
										<ContextMenu>
											<ContextMenuTrigger className='h-full w-full'>
												<TableCell
													key={`cell-${rowId}-${column.name}`}
													value={row[column.name] === null ? null : String(row[column.name])}
													columnName={column.name}
													onChange={value => handleCellUpdate(rowId, column.name, value)}
													onStartEdit={() => startEditing(rowId, column.name)}
													onCancelEdit={cancelEditing}
													isEditing={isEditing(rowId, column.name)}
													type={column.type}
													rowId={rowId}
												/>
											</ContextMenuTrigger>
											<ContextMenuContent>
												<ContextMenuItem onClick={() => navigator.clipboard.writeText(String(row[column.name]))}>
													Copy cell content
												</ContextMenuItem>
											</ContextMenuContent>
										</ContextMenu>
									</BaseTableCell>
								))}
							</TableRow>
						)
					})}
				</TableBody>
			</Table>
		</div>
	)
}
