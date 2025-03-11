'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Filter, SortAsc, Plus, ChevronDownIcon, Rows, FileText, Trash2, ChevronDown, FileOutput } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { InsertRowDrawer } from './insert-row-drawer'
import type { TableToolbarProps } from '../types'

export function TableToolbar({ selectedTable, columns, onInsertRow, selectedRows, onDeleteRows }: TableToolbarProps) {
	const [isInsertRowOpen, setIsInsertRowOpen] = useState(false)
	const selectedCount = selectedRows.size

	const handleDeleteSelected = () => {
		if (onDeleteRows && selectedCount > 0) {
			onDeleteRows(Array.from(selectedRows))
		}
	}

	return (
		<>
			<div className='flex items-center p-2 border-b gap-2'>
				{selectedCount > 0 ? (
					<>
						<Button variant='outline' size='sm' className='flex items-center gap-2' onClick={handleDeleteSelected}>
							<Trash2 className='h-4 w-4' />
							Delete {selectedCount} rows
						</Button>

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant='outline' size='sm' className='flex items-center gap-2'>
									<FileOutput className='h-4 w-4' />
									Export
									<ChevronDown className='h-4 w-4' />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align='start'>
								<DropdownMenuItem className='cursor-pointer'>Export to CSV</DropdownMenuItem>
								<DropdownMenuItem className='cursor-pointer'>Export to SQL</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</>
				) : (
					<>
						<Button variant='outline' size='sm'>
							<Filter className='h-4 w-4 mr-2' />
							Filter
						</Button>

						<Button variant='outline' size='sm'>
							<SortAsc className='h-4 w-4 mr-2' />
							Sort
						</Button>

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant='default' size='sm'>
									<Plus className='h-4 w-4 mr-2' />
									Insert
									<ChevronDownIcon className='h-4 w-4 ml-1' />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align='start' className='w-80'>
								<DropdownMenuItem className='py-3 cursor-pointer' onClick={() => setIsInsertRowOpen(true)}>
									<Rows className='h-5 w-5 mr-3 text-muted-foreground' />
									<div className='flex flex-col'>
										<span className='font-medium'>Insert row</span>
										<span className='text-xs text-muted-foreground'>Insert a new row into {selectedTable}</span>
									</div>
								</DropdownMenuItem>

								<DropdownMenuItem className='py-3 cursor-pointer'>
									<FileText className='h-5 w-5 mr-3 text-muted-foreground' />
									<div className='flex flex-col'>
										<span className='font-medium'>Import data from CSV</span>
										<span className='text-xs text-muted-foreground'>Insert new rows from a CSV</span>
									</div>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</>
				)}
			</div>

			<InsertRowDrawer
				isOpen={isInsertRowOpen}
				onClose={() => setIsInsertRowOpen(false)}
				columns={columns}
				selectedTable={selectedTable}
				onSubmit={onInsertRow}
			/>
		</>
	)
}
