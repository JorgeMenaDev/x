'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
	Filter,
	Plus,
	Lock,
	Eye,
	ChevronDown,
	Database,
	MoreVertical,
	Copy,
	Edit,
	Clipboard,
	FileOutput,
	Trash2,
	Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import type { SidebarProps } from '../types'

export function Sidebar({
	selectedSchema,
	selectedTable,
	tables,
	onTableSelect,
	searchQuery,
	onSearchChange,
	isLoading = false
}: SidebarProps) {
	// Filter tables based on search query
	const filteredTables = tables.filter(
		table =>
			table.schema === selectedSchema &&
			(searchQuery === '' || table.name.toLowerCase().includes(searchQuery.toLowerCase()))
	)

	// Handle copy table name
	const handleCopyName = (e: React.MouseEvent, tableName: string) => {
		e.stopPropagation() // Prevent triggering the table selection
		navigator.clipboard.writeText(tableName)
		// You could add a toast notification here if you have a toast component
	}

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
				{isLoading ? (
					<div className='flex items-center justify-center h-20'>
						<Loader2 className='h-5 w-5 animate-spin text-muted-foreground' />
						<span className='ml-2 text-sm text-muted-foreground'>Loading tables...</span>
					</div>
				) : filteredTables.length === 0 ? (
					<div className='p-4 text-sm text-muted-foreground text-center'>No tables found</div>
				) : (
					filteredTables.map(table => (
						<div
							key={table.name}
							className={cn(
								'flex items-center px-2 py-1 text-sm cursor-pointer hover:bg-muted/50 group',
								selectedTable === table.name && 'bg-muted'
							)}
							onClick={() => onTableSelect(table.name)}
						>
							<div className='w-5 flex justify-center'>
								{table.name === 'inventory' || table.name === 'price_lists' ? (
									<Lock className='h-3.5 w-3.5 text-amber-500' />
								) : table.name === 'product_embeddings' || table.name === 'product_embeddings_cache' ? (
									<Eye className='h-3.5 w-3.5 text-muted-foreground' />
								) : (
									<Database className='h-3.5 w-3.5 text-muted-foreground' />
								)}
							</div>
							<span className='flex-1 ml-1'>{table.name}</span>

							<div className='opacity-0 group-hover:opacity-100 transition-opacity'>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant='ghost'
											size='icon'
											className='h-5 w-5 p-0'
											onClick={e => e.stopPropagation()} // Prevent triggering the table selection
										>
											<MoreVertical className='h-3.5 w-3.5 text-muted-foreground' />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align='end' className='w-56'>
										<DropdownMenuItem className='cursor-pointer' onClick={e => handleCopyName(e, table.name)}>
											<Copy className='h-4 w-4 mr-2' />
											Copy name
										</DropdownMenuItem>
										<DropdownMenuItem className='cursor-pointer' onClick={e => e.stopPropagation()}>
											<Edit className='h-4 w-4 mr-2' />
											Edit table
										</DropdownMenuItem>
										<DropdownMenuItem className='cursor-pointer' onClick={e => e.stopPropagation()}>
											<Clipboard className='h-4 w-4 mr-2' />
											Duplicate table
										</DropdownMenuItem>
										<DropdownMenuItem className='cursor-pointer' onClick={e => e.stopPropagation()}>
											<Eye className='h-4 w-4 mr-2' />
											View policies
										</DropdownMenuItem>
										<DropdownMenuItem className='cursor-pointer' onClick={e => e.stopPropagation()}>
											<FileOutput className='h-4 w-4 mr-2' />
											Export data
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											className='cursor-pointer text-destructive focus:text-destructive'
											onClick={e => e.stopPropagation()}
										>
											<Trash2 className='h-4 w-4 mr-2' />
											Delete table
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	)
}
