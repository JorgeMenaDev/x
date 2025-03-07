'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell as BaseTableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu'
import { TableCell } from '@/components/table-editor/components/table-cell'
import type { TableViewProps } from '../types'
import { TableRecord } from '@/models/inventory/table'
import { validateField, isFieldEditable } from '@/lib/validation/table-schemas'
import { toast } from 'sonner'

interface EditingCell {
	rowId: string
	columnName: string
}

export function TableView({
	columns,
	data,
	selectedRows,
	onSelectRow,
	selectAll,
	onSelectAll,
	onUpdateRow
}: TableViewProps) {
	const [editingCell, setEditingCell] = useState<EditingCell | null>(null)
	const [localData, setLocalData] = useState<TableRecord[]>(data)

	// Update local data when prop changes
	useEffect(() => {
		setLocalData(data)
	}, [data])

	const handleCellUpdate = (rowId: string, columnName: string, value: string | null) => {
		// Find the column definition
		const column = columns.find(col => col.name === columnName)
		if (!column) return

		// Check if the field is editable
		if (!isFieldEditable(column)) {
			toast.error('This field cannot be edited')
			setEditingCell(null)
			return
		}

		// Validate the new value
		const validation = validateField(value, column)
		if (!validation.success) {
			toast.error(validation.error || 'Invalid value for this field type')
			setEditingCell(null)
			return
		}

		// Update local state immediately for UI responsiveness
		setLocalData(prevData =>
			prevData.map(row => (row.id === rowId ? { ...row, [columnName]: value === null ? null : value } : row))
		)

		// Notify parent component with the correct data structure
		if (onUpdateRow) {
			// Ensure data is not empty
			const updateData = { [columnName]: value }
			if (Object.keys(updateData).length === 0) {
				toast.error('No data to update')
				setEditingCell(null)
				return
			}
			onUpdateRow(rowId, updateData)
		}
		setEditingCell(null)
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

		setEditingCell({ rowId, columnName })
	}

	const cancelEditing = () => {
		setEditingCell(null)
	}

	const isEditing = (rowId: string, columnName: string) => {
		return editingCell?.rowId === rowId && editingCell?.columnName === columnName
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
					{localData.map(row => (
						<TableRow key={row.id as string} className='h-8'>
							<BaseTableCell className='p-2'>
								<Checkbox
									checked={selectedRows.has(row.id as string)}
									onCheckedChange={() => onSelectRow(row.id as string)}
									className=''
								/>
							</BaseTableCell>
							{columns.map(column => (
								<BaseTableCell
									key={`${row.id}-${column.name}`}
									className={`p-0 ${!isFieldEditable(column) ? 'cursor-not-allowed bg-muted/30' : ''}`}
								>
									<ContextMenu>
										<ContextMenuTrigger className='h-full w-full'>
											<TableCell
												value={row[column.name] === null ? null : String(row[column.name])}
												columnName={column.name}
												onChange={value => handleCellUpdate(row.id as string, column.name, value)}
												onStartEdit={() => startEditing(row.id as string, column.name)}
												onCancelEdit={cancelEditing}
												isEditing={isEditing(row.id as string, column.name)}
												type={column.type}
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
					))}
				</TableBody>
			</Table>
		</div>
	)
}
