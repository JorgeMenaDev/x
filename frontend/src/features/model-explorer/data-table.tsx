'use client'

import * as React from 'react'
import type { ColumnDef, ColumnFiltersState, SortingState, RowSelectionState } from '@tanstack/react-table'
import {
	flexRender,
	getCoreRowModel,
	getFacetedMinMaxValues,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable
} from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/custom/table'
import { DataTableFilterControls } from '@/components/data-table/data-table-filter-controls'
import { DataTablePagination } from '@/components/data-table/data-table-pagination'
import { DataTableFilterCommand } from '@/components/data-table/data-table-filter-command'
import { modelFilterSchema } from './filter-schema'
import type { DataTableFilterField } from '@/components/data-table/types'
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar'
import { cn } from '@/lib/utils'
import { useLocalStorage } from '@/features/default-table/hooks/use-local-storage'
import { DataTableProvider } from '@/components/data-table/data-table-provider'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'

export interface ModelDataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[]
	data: TData[]
	defaultColumnFilters?: ColumnFiltersState
	filterFields?: DataTableFilterField<TData>[]
	onFiltersChange?: (filters: ColumnFiltersState) => void
}

export function ModelDataTable<TData, TValue>({
	columns,
	data,
	defaultColumnFilters = [],
	filterFields = [],
	onFiltersChange
}: ModelDataTableProps<TData, TValue>) {
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(defaultColumnFilters)
	const [sorting, setSorting] = React.useState<SortingState>([])
	const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
	const [pagination, setPagination] = React.useState({
		pageIndex: 0,
		pageSize: 10
	})
	const [columnVisibility, setColumnVisibility] = useLocalStorage('model-table-visibility', {})

	// Custom column filters handler that also calls the external handler if provided
	const handleColumnFiltersChange = React.useCallback(
		(updaterOrValue: any) => {
			// First update the internal state
			setColumnFilters(updaterOrValue)

			// Then call the external handler if provided
			if (onFiltersChange) {
				// If it's a function, call it with current value to get the new value
				const newValue = typeof updaterOrValue === 'function' ? updaterOrValue(columnFilters) : updaterOrValue

				onFiltersChange(newValue)
			}
		},
		[onFiltersChange, columnFilters]
	)

	// Add selection column to the beginning of columns array
	const columnsWithSelection = React.useMemo<ColumnDef<TData, TValue>[]>(
		() => [
			{
				id: 'select',
				header: ({ table }) => (
					<Checkbox
						checked={table.getIsAllPageRowsSelected()}
						onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
						aria-label='Select all'
					/>
				),
				cell: ({ row }) => (
					<Checkbox
						checked={row.getIsSelected()}
						onCheckedChange={value => row.toggleSelected(!!value)}
						aria-label='Select row'
					/>
				),
				enableSorting: false,
				enableHiding: false
			},
			...columns
		],
		[columns]
	)

	const table = useReactTable({
		data,
		columns: columnsWithSelection,
		state: {
			columnFilters,
			sorting,
			columnVisibility,
			pagination,
			rowSelection
		},
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		onColumnVisibilityChange: setColumnVisibility,
		onColumnFiltersChange: handleColumnFiltersChange,
		onSortingChange: setSorting,
		onPaginationChange: setPagination,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getFacetedMinMaxValues: getFacetedMinMaxValues(),
		getFacetedUniqueValues: getFacetedUniqueValues()
	})

	return (
		<DataTableProvider
			table={table}
			columns={columnsWithSelection}
			filterFields={filterFields}
			columnFilters={columnFilters}
			sorting={sorting}
			pagination={pagination}
		>
			<div className='flex h-full w-full flex-col gap-3 sm:flex-row'>
				<div
					className={cn(
						'hidden w-full p-1 sm:block sm:min-w-52 sm:max-w-52 sm:self-start md:min-w-64 md:max-w-64',
						'group-data-[expanded=false]/controls:hidden'
					)}
				>
					<DataTableFilterControls />
				</div>
				<div className='flex max-w-full flex-1 flex-col gap-4 overflow-hidden p-1'>
					<DataTableFilterCommand schema={modelFilterSchema} />
					<DataTableToolbar />
					{table.getSelectedRowModel().rows.length > 0 && (
						<div className='flex items-center gap-2'>
							<span className='text-sm text-muted-foreground'>
								{table.getSelectedRowModel().rows.length} row(s) selected
							</span>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant='ghost' size='sm'>
										<MoreHorizontal className='h-4 w-4' />
										<span className='sr-only'>Actions</span>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align='end'>
									<DropdownMenuItem onClick={() => console.log('Action A')}>Action A</DropdownMenuItem>
									<DropdownMenuItem onClick={() => console.log('Action B')}>Action B</DropdownMenuItem>
									<DropdownMenuItem onClick={() => console.log('Action C')}>Action C</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					)}
					<div className='rounded-md border'>
						<Table>
							<TableHeader className='bg-muted/50'>
								{table.getHeaderGroups().map(headerGroup => (
									<TableRow key={headerGroup.id} className='hover:bg-transparent'>
										{headerGroup.headers.map(header => {
											return (
												<TableHead key={header.id}>
													{header.isPlaceholder
														? null
														: flexRender(header.column.columnDef.header, header.getContext())}
												</TableHead>
											)
										})}
									</TableRow>
								))}
							</TableHeader>
							<TableBody>
								{table.getRowModel().rows?.length ? (
									table.getRowModel().rows.map(row => (
										<TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
											{row.getVisibleCells().map(cell => (
												<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
											))}
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell colSpan={columnsWithSelection.length} className='h-24 text-center'>
											No results.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
					<DataTablePagination />
				</div>
			</div>
		</DataTableProvider>
	)
}
