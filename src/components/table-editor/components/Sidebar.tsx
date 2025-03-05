'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Filter, Plus, Lock, Eye, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SidebarProps } from '../types'

export function Sidebar({
	selectedSchema,
	selectedTable,
	tables,
	onTableSelect,
	searchQuery,
	onSearchChange
}: SidebarProps) {
	const filteredTables = tables.filter(table => table.toLowerCase().includes(searchQuery.toLowerCase()))

	return (
		<div className='w-56 border-r overflow-y-auto flex flex-col'>
			<div className='p-4 border-b'>
				<div className='flex items-center space-x-1'>
					<span className='text-sm'>schema</span>
					<span className='text-sm font-medium'>{selectedSchema}</span>
					<ChevronDown className='h-4 w-4 ml-auto' />
				</div>
			</div>

			<div className='p-4 border-b'>
				<Button variant='outline' size='sm' className='w-full justify-start'>
					<Plus className='h-4 w-4 mr-2' />
					New table
				</Button>
			</div>

			<div className='p-2'>
				<div className='relative'>
					<Input
						placeholder='Search tables...'
						className='pl-8 h-8 text-sm'
						value={searchQuery}
						onChange={e => onSearchChange(e.target.value)}
					/>
					<Filter className='h-4 w-4 absolute left-2 top-2 text-muted-foreground' />
				</div>
			</div>

			<div className='flex-1 overflow-y-auto'>
				{filteredTables.map(table => (
					<div
						key={table}
						className={cn(
							'flex items-center px-2 py-1 text-sm cursor-pointer hover:bg-muted/50',
							selectedTable === table && 'bg-muted'
						)}
						onClick={() => onTableSelect(table)}
					>
						<div className='w-5 flex justify-center'>
							{table === 'email_sections' && <Lock className='h-3 w-3 text-amber-500' />}
							{table === 'emails' && <Lock className='h-3 w-3 text-amber-500' />}
							{table === 'reported_products' && <Eye className='h-3 w-3 text-muted-foreground' />}
						</div>
						<span>{table}</span>
					</div>
				))}
			</div>
		</div>
	)
}
