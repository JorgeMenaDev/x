'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Filter, SortAsc, Plus, ChevronDownIcon, Rows, Columns, FileText } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { InsertRowDrawer } from './InsertRowDrawer'
import type { TableToolbarProps } from '../types'

export function TableToolbar({ selectedTable, columns, onInsertRow }: TableToolbarProps) {
	const [isInsertRowOpen, setIsInsertRowOpen] = useState(false)

	return (
		<>
			<div className='flex items-center p-2 border-b gap-2'>
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
						<Button variant='default' size='sm' className='bg-emerald-500 hover:bg-emerald-600'>
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
							<Columns className='h-5 w-5 mr-3 text-muted-foreground' />
							<div className='flex flex-col'>
								<span className='font-medium'>Insert column</span>
								<span className='text-xs text-muted-foreground'>Insert a new column into {selectedTable}</span>
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

				<div className='ml-auto flex items-center gap-2'>
					<Badge variant='outline' className='rounded-md'>
						Auth policies
					</Badge>

					<Badge variant='outline' className='rounded-md'>
						Role: postgres
					</Badge>

					<Badge variant='outline' className='rounded-md'>
						Realtime off
					</Badge>

					<Badge variant='outline' className='rounded-md'>
						API Docs
					</Badge>
				</div>
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
