'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Filter, SortAsc, Plus, ChevronDown, ChevronRight, Lock, Eye, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ChevronDownIcon, FileText, Rows, Columns } from 'lucide-react'

type TableColumn = {
	name: string
	type: string
	sortable: boolean
}

type TableData = {
	[key: string]: any
}

export function TableEditor() {
	const [selectedSchema, setSelectedSchema] = useState('public')
	const [selectedTable, setSelectedTable] = useState('')
	const [tables, setTables] = useState<string[]>([
		'email_sections',
		'emails',
		'extracted_products',
		'inventory',
		'matched_products',
		'offices',
		'price_lists',
		'product_embeddings',
		'product_embeddings_cache',
		'product_types',
		'products',
		'quotes',
		'reported_products',
		'system_settings',
		'variant_prices',
		'variant_stocks',
		'variants',
		'webhook_events'
	])

	const [columns, setColumns] = useState<TableColumn[]>([
		{ name: 'id', type: 'uuid', sortable: true },
		{ name: 'created_at', type: 'timestamp', sortable: true },
		{ name: 'total_amount', type: 'int4', sortable: true },
		{ name: 'exact_matches', type: 'int4', sortable: true },
		{ name: 'similar_matches', type: 'int4', sortable: true },
		{ name: 'no_matches', type: 'int4', sortable: true },
		{ name: 'file_url', type: 'text', sortable: true }
	])

	const [data, setData] = useState<TableData[]>([
		{
			id: '0e7b2b60-370c-414f-8ff3-7f09acb9c15b',
			created_at: '2025-03-05 08:12:04.697987+00',
			total_amount: 25540,
			exact_matches: 2,
			similar_matches: 19,
			no_matches: 0,
			file_url: 'https://xxflsmtjt'
		},
		{
			id: '1ef77c69-bdd5-4e5a-aef3-33458c1304d9',
			created_at: '2025-03-05 08:03:21.088476+00',
			total_amount: 27530,
			exact_matches: 2,
			similar_matches: 19,
			no_matches: 0,
			file_url: 'https://xxflsmtjt'
		},
		{
			id: '22d0aa4c-eba9-4f90-a7ef-f5c8dc8a041c',
			created_at: '2025-02-27 11:26:06.461332+00',
			total_amount: 13980,
			exact_matches: 0,
			similar_matches: 1,
			no_matches: 0,
			file_url: 'https://xxflsmtjt'
		},
		{
			id: '2492e848-ae8f-43bb-825d-6a7363e748fe',
			created_at: '2025-02-28 02:48:52.150854+00',
			total_amount: 23920,
			exact_matches: 0,
			similar_matches: 5,
			no_matches: 38,
			file_url: 'https://xxflsmtjt'
		},
		{
			id: '445340be-a2bb-4859-8c38-c4e60510f5c',
			created_at: '2025-03-05 02:02:19.24381+00',
			total_amount: 27630,
			exact_matches: 2,
			similar_matches: 19,
			no_matches: 0,
			file_url: 'https://xxflsmtjt'
		},
		{
			id: '4af0f20f-e67c-4832-a9e2-3920580d4527',
			created_at: '2025-02-26 02:46:31.255023+00',
			total_amount: 13980,
			exact_matches: 0,
			similar_matches: 1,
			no_matches: 0,
			file_url: 'https://xxflsmtjt'
		},
		{
			id: '4f5e3224-3f82-40fb-aed0-bf67be575f76',
			created_at: '2025-02-27 12:11:43.610025+00',
			total_amount: 234840,
			exact_matches: 2,
			similar_matches: 48,
			no_matches: 14,
			file_url: 'https://xxflsmtjt'
		},
		{
			id: '512cf46c-4032-42fe-a8f9-90a49095cfa2',
			created_at: '2025-03-05 00:07:43.851285+00',
			total_amount: 25750,
			exact_matches: 2,
			similar_matches: 13,
			no_matches: 6,
			file_url: 'https://xxflsmtjt'
		},
		{
			id: '533c50fd-2363-4a69-b483-16b807135225',
			created_at: '2025-02-23 13:34:33.67693+00',
			total_amount: 135998,
			exact_matches: 0,
			similar_matches: 28,
			no_matches: 8,
			file_url: 'https://xxflsmtjt'
		},
		{
			id: '53db740b-6a75-4e2b-ba01-2f314c5bf425',
			created_at: '2025-03-03 02:40:56.391972+00',
			total_amount: 70920,
			exact_matches: 0,
			similar_matches: 24,
			no_matches: 34,
			file_url: 'https://xxflsmtjt'
		},
		{
			id: '54317ec0-3c15-40b1-97b2-f2b49df9d16f',
			created_at: '2025-02-23 04:41:01.841239+00',
			total_amount: 674361,
			exact_matches: 0,
			similar_matches: 52,
			no_matches: 5,
			file_url: 'https://xxflsmtjt'
		},
		{
			id: '581b85c1-ffa2-4160-a9e1-bf8da88d9524',
			created_at: '2025-02-23 12:41:25.483502+00',
			total_amount: 92145,
			exact_matches: 0,
			similar_matches: 26,
			no_matches: 2,
			file_url: 'https://xxflsmtjt'
		},
		{
			id: '5e60b21f-2dd3-4e8d-b4d9-7ac8bbaebcb5',
			created_at: '2025-02-27 08:10:39.92962+00',
			total_amount: 13980,
			exact_matches: 0,
			similar_matches: 1,
			no_matches: 0,
			file_url: 'https://xxflsmtjt'
		},
		{
			id: '6253a0fe-3a1d-4412-815d-12f725261ee7',
			created_at: '2025-02-27 18:59:19.215175+00',
			total_amount: 234930,
			exact_matches: 0,
			similar_matches: 46,
			no_matches: 18,
			file_url: 'https://xxflsmtjt'
		},
		{
			id: '658ed488-c154-4b9e-8320-3d62bae6b3c',
			created_at: '2025-02-27 23:57:41.911751+00',
			total_amount: 13980,
			exact_matches: 0,
			similar_matches: 1,
			no_matches: 0,
			file_url: 'https://xxflsmtjt'
		}
	])

	const [searchQuery, setSearchQuery] = useState('')
	const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
	const [selectAll, setSelectAll] = useState(false)
	const [currentPage, setCurrentPage] = useState(1)
	const [totalRecords, setTotalRecords] = useState(31)
	const [rowsPerPage] = useState(100)

	const handleSelectAll = () => {
		if (selectAll) {
			setSelectedRows(new Set())
		} else {
			const allIds = data.map(row => row.id)
			setSelectedRows(new Set(allIds))
		}
		setSelectAll(!selectAll)
	}

	const handleSelectRow = (id: string) => {
		const newSelectedRows = new Set(selectedRows)
		if (newSelectedRows.has(id)) {
			newSelectedRows.delete(id)
		} else {
			newSelectedRows.add(id)
		}
		setSelectedRows(newSelectedRows)
		setSelectAll(newSelectedRows.size === data.length)
	}

	const filteredTables = tables.filter(table => table.toLowerCase().includes(searchQuery.toLowerCase()))

	return (
		<div className='flex flex-col h-screen'>
			<div className='border-b'>
				<h1 className='p-4 text-lg font-medium'>Table Editor</h1>
			</div>

			<div className='flex flex-1 overflow-hidden'>
				{/* Left sidebar */}
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
								onChange={e => setSearchQuery(e.target.value)}
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
								onClick={() => setSelectedTable(table)}
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

				{/* Main content */}
				<div className='flex-1 flex flex-col overflow-hidden'>
					{/* Toolbar */}
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
								<DropdownMenuItem className='py-3 cursor-pointer'>
									<Rows className='h-5 w-5 mr-3 text-muted-foreground' />
									<div className='flex flex-col'>
										<span className='font-medium'>Insert row</span>
										<span className='text-xs text-muted-foreground'>Insert a new row into quotes</span>
									</div>
								</DropdownMenuItem>
								<DropdownMenuItem className='py-3 cursor-pointer'>
									<Columns className='h-5 w-5 mr-3 text-muted-foreground' />
									<div className='flex flex-col'>
										<span className='font-medium'>Insert column</span>
										<span className='text-xs text-muted-foreground'>Insert a new column into quotes</span>
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

					{/* Table */}
					<div className='flex-1 overflow-auto'>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className='w-[40px]'>
										<Checkbox checked={selectAll} onCheckedChange={handleSelectAll} />
									</TableHead>
									{columns.map(column => (
										<TableHead key={column.name} className='whitespace-nowrap'>
											<div className='flex items-center gap-1'>
												{column.name === 'id' && (
													<Badge
														variant='outline'
														className='h-5 px-1 text-xs bg-green-50 text-green-600 border-green-200'
													>
														id
													</Badge>
												)}
												<span>{column.name}</span>
												<span className='text-xs text-muted-foreground'>{column.type}</span>
												{column.sortable && <ChevronDown className='h-3 w-3 text-muted-foreground' />}
											</div>
										</TableHead>
									))}
								</TableRow>
							</TableHeader>
							<TableBody>
								{data.map(row => (
									<TableRow key={row.id}>
										<TableCell>
											<Checkbox checked={selectedRows.has(row.id)} onCheckedChange={() => handleSelectRow(row.id)} />
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

					{/* Pagination */}
					<div className='border-t p-2 flex items-center justify-between text-sm'>
						<div className='flex items-center gap-2'>
							<Button variant='ghost' size='icon' className='h-8 w-8'>
								<ChevronRight className='h-4 w-4 rotate-180' />
							</Button>

							<span>Page</span>
							<Input
								value={currentPage}
								onChange={e => setCurrentPage(Number(e.target.value))}
								className='h-8 w-12 text-center'
							/>

							<span>of {Math.ceil(totalRecords / rowsPerPage)}</span>

							<Button variant='ghost' size='icon' className='h-8 w-8'>
								<ChevronRight className='h-4 w-4' />
							</Button>

							<span>{rowsPerPage} rows</span>
							<span>{totalRecords} records</span>
						</div>

						<div className='flex items-center gap-2'>
							<Button variant='outline' size='sm' className='h-8'>
								<RefreshCw className='h-4 w-4 mr-2' />
								Refresh
							</Button>

							<Button variant='outline' size='sm' className='h-8'>
								Data
							</Button>

							<Button variant='outline' size='sm' className='h-8'>
								Definition
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
