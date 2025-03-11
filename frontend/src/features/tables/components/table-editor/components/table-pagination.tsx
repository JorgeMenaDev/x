'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronRight, RefreshCw } from 'lucide-react'
import type { TablePaginationProps } from '../types'

export function TablePagination({ currentPage, totalRecords, rowsPerPage, onPageChange }: TablePaginationProps) {
	const totalPages = Math.ceil(totalRecords / rowsPerPage)

	return (
		<div className='border-t p-2 flex items-center justify-between text-sm'>
			<div className='flex items-center gap-2'>
				<Button
					variant='ghost'
					size='icon'
					className='h-8 w-8'
					onClick={() => onPageChange(Math.max(1, currentPage - 1))}
					disabled={currentPage === 1}
				>
					<ChevronRight className='h-4 w-4 rotate-180' />
				</Button>

				<span>Page</span>
				<Input
					value={currentPage}
					onChange={e => {
						const page = Number(e.target.value)
						if (page >= 1 && page <= totalPages) {
							onPageChange(page)
						}
					}}
					className='h-8 w-12 text-center'
				/>

				<span>of {totalPages}</span>

				<Button
					variant='ghost'
					size='icon'
					className='h-8 w-8'
					onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
					disabled={currentPage === totalPages}
				>
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
	)
}
