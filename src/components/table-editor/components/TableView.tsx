'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell as BaseTableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu'
import { TableCell } from '@/components/table-cell'
import type { TableViewProps } from '../types'

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
	onCellEdit
}: TableViewProps) {
	const [editingCell, setEditingCell] = useState<EditingCell | null>(null)
	const [localData, setLocalData] = useState(data)

	// Update local data when prop changes
	useEffect(() => {
		setLocalData(data)
	}, [data])

	const updateCell = (rowId: string, columnName: string, value: string | null) => {
		// Update local state immediately for UI responsiveness
		setLocalData(prevData =>
			prevData.map(row => (row.id === rowId ? { ...row, [columnName]: value === null ? null : value } : row))
		)

		// Notify parent component
		onCellEdit?.(rowId, columnName, value)
		setEditingCell(null)
	}

	const startEditing = (rowId: string, columnName: string) => {
		setEditingCell({ rowId, columnName })
	}

	const cancelEditing = () => {
		setEditingCell(null)
	}

	const isEditing = (rowId: string, columnName: string) => {
		return editingCell?.rowId === rowId && editingCell?.columnName === columnName
	}

	return (
		<div className='flex-1 overflow-auto text-sm'>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className='w-[40px]'>
							<Checkbox checked={selectAll} onCheckedChange={onSelectAll} />
						</TableHead>
						{columns.map(column => (
							<TableHead key={column.name}>
								<div className='flex items-center gap-1'>
									<span>{column.name}</span>
									<span className='text-xs text-muted-foreground'>{column.type}</span>
								</div>
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{localData.map(row => (
						<TableRow key={row.id}>
							<BaseTableCell>
								<Checkbox checked={selectedRows.has(row.id)} onCheckedChange={() => onSelectRow(row.id)} />
							</BaseTableCell>
							{columns.map(column => (
								<BaseTableCell key={`${row.id}-${column.name}`} className='p-0'>
									<ContextMenu>
										<ContextMenuTrigger className='h-full w-full'>
											<TableCell
												value={row[column.name] === null ? null : String(row[column.name])}
												onChange={value => updateCell(row.id, column.name, value)}
												onStartEdit={() => startEditing(row.id, column.name)}
												onCancelEdit={cancelEditing}
												isEditing={isEditing(row.id, column.name)}
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
