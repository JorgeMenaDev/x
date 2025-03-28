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
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import { AddModelUseDialog } from '../models/components/add-model-use-dialog'
import { ViewModelDetailsDialog } from '../models/components/view-model-details-dialog'

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
	const [addModelUseDialogOpen, setAddModelUseDialogOpen] = React.useState(false)
	const [viewDetailsDialogOpen, setViewDetailsDialogOpen] = React.useState(false)
	const [selectedModelId, setSelectedModelId] = React.useState<string>('')
	const [selectedModelData, setSelectedModelData] = React.useState<any>(null)

	const handleColumnFiltersChange = React.useCallback(
		(updaterOrValue: any) => {
			setColumnFilters(updaterOrValue)

			if (onFiltersChange) {
				const newValue = typeof updaterOrValue === 'function' ? updaterOrValue(columnFilters) : updaterOrValue
				onFiltersChange(newValue)
			}
		},
		[onFiltersChange, columnFilters]
	)

	// Add actions column to the end of columns array
	const columnsWithActions = React.useMemo<ColumnDef<TData, TValue>[]>(
		() => [
			...columns,
			{
				id: 'actions',
				header: 'Actions',
				cell: ({ row }) => {
					const modelId = (row.original as any)?.id || (row.original as any)?.model_id || ''
					const rowData = row.original || null

					return (
						<>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant='ghost' size='sm'>
										<MoreHorizontal className='h-4 w-4' />
										<span className='sr-only'>Actions</span>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align='end'>
									<DropdownMenuItem
										onClick={() => {
											if (rowData) {
												setSelectedModelId(modelId)
												setSelectedModelData(rowData)
												setViewDetailsDialogOpen(true)
											}
										}}
									>
										View details
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => {
											if (modelId) {
												setSelectedModelId(modelId)
												setAddModelUseDialogOpen(true)
											}
										}}
									>
										Add new model use
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => console.log('Action B')}>Add model relationship</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
							{modelId && (
								<>
									<AddModelUseDialog
										modelId={selectedModelId}
										open={addModelUseDialogOpen && selectedModelId === modelId}
										onOpenChange={open => {
											setAddModelUseDialogOpen(open)
											if (!open) setSelectedModelId('')
										}}
									/>
									<ViewModelDetailsDialog
										modelData={selectedModelData}
										open={viewDetailsDialogOpen && selectedModelId === modelId}
										onOpenChange={open => {
											setViewDetailsDialogOpen(open)
											if (!open) {
												setSelectedModelId('')
												setSelectedModelData(null)
											}
										}}
									/>
								</>
							)}
						</>
					)
				},
				enableSorting: false,
				enableHiding: false
			}
		],
		[columns, selectedModelId, addModelUseDialogOpen, viewDetailsDialogOpen, selectedModelData]
	)

	const table = useReactTable({
		data,
		columns: columnsWithActions,
		state: {
			columnFilters,
			sorting,
			columnVisibility,
			pagination
		},
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
			columns={columnsWithActions}
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
										<TableRow key={row.id}>
											{row.getVisibleCells().map(cell => (
												<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
											))}
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell colSpan={columnsWithActions.length} className='h-24 text-center'>
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
