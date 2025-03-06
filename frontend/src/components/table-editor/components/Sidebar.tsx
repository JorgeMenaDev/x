'use client'

import { Input } from '@/components/ui/input'
import { SidebarProps } from '../types'

export function Sidebar({
	selectedSchema,
	selectedTable,
	tables,
	onTableSelect,
	searchQuery,
	onSearchChange,
	isLoading
}: SidebarProps) {
	// Filter tables based on search query and schema
	const filteredTables = tables.filter(
		table =>
			table.schema === selectedSchema &&
			(searchQuery === '' || table.name.toLowerCase().includes(searchQuery.toLowerCase()))
	)

	return (
		<div className='w-64 border-r p-4 flex flex-col'>
			<div className='mb-4'>
				<Input
					type='text'
					placeholder='Search tables...'
					value={searchQuery}
					onChange={e => onSearchChange(e.target.value)}
					className='w-full'
				/>
			</div>

			<div className='flex-1 overflow-auto'>
				{isLoading ? (
					<div className='flex items-center justify-center h-32'>
						<div className='animate-spin rounded-full h-6 w-6 border-b-2 border-primary'></div>
					</div>
				) : filteredTables.length === 0 ? (
					<div className='text-center text-sm text-muted-foreground p-4'>No tables found</div>
				) : (
					<ul className='space-y-1'>
						{filteredTables.map(table => (
							<li key={table.name}>
								<button
									onClick={() => onTableSelect(table.name)}
									className={`w-full text-left px-2 py-1 rounded text-sm ${
										selectedTable === table.name
											? 'bg-primary text-primary-foreground'
											: 'hover:bg-muted text-foreground'
									}`}
								>
									{table.name}
								</button>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	)
}
