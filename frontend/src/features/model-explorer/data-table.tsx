'use client'

import * as React from 'react'
import type { ColumnDef, ColumnFiltersState, SortingState } from '@tanstack/react-table'
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

	const table = useReactTable({
		data,
		columns,
		state: { columnFilters, sorting, columnVisibility, pagination },
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
			columns={columns}
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
										<TableCell colSpan={columns.length} className='h-24 text-center'>
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
