'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import type { TableViewProps } from '../types'

export function TableView({ columns, data, selectedRows, onSelectRow, selectAll, onSelectAll }: TableViewProps) {
	return (
		<div className='flex-1 overflow-auto'>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className='w-[40px]'>
							<Checkbox checked={selectAll} onCheckedChange={onSelectAll} />
						</TableHead>
						{columns.map(column => (
							<TableHead key={column.name} className='whitespace-nowrap'>
								<div className='flex items-center gap-1'>
									<span>{column.name}</span>
									<span className='text-xs text-muted-foreground'>{column.type}</span>
								</div>
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.map(row => (
						<TableRow key={row.id}>
							<TableCell>
								<Checkbox checked={selectedRows.has(row.id)} onCheckedChange={() => onSelectRow(row.id)} />
							</TableCell>
							{columns.map(column => (
								<TableCell key={`${row.id}-${column.name}`} className='whitespace-nowrap truncate max-w-[200px]'>
									{row[column.name]}
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}
