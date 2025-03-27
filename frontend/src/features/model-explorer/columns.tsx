'use client'

import { Badge } from '@/components/ui/badge'
import type { ColumnDef } from '@tanstack/react-table'
import { format, isSameDay } from 'date-fns'
import { isArrayOfDates } from '@/lib/is-array'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { riskRatingColors } from './constants'
import type { ModelSchema } from './schema'

export const columns: ColumnDef<ModelSchema>[] = [
	{
		accessorKey: 'id',
		header: 'ID',
		enableHiding: false
	},
	{
		accessorKey: 'name',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Name' />,
		enableHiding: false
	},
	{
		accessorKey: 'type',
		header: 'Type',
		cell: ({ row }) => {
			return <Badge variant='outline'>{row.getValue('type')}</Badge>
		},
		filterFn: (row, id, value) => {
			const rowValue = row.getValue(id) as string
			if (typeof value === 'string') return value === rowValue
			if (Array.isArray(value)) return value.includes(rowValue)
			return false
		}
	},
	{
		accessorKey: 'purpose',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Purpose' />,
		filterFn: (row, id, value) => {
			const rowValue = row.getValue(id) as string
			if (typeof value === 'string') return value === rowValue
			if (Array.isArray(value)) return value.includes(rowValue)
			return false
		}
	},
	{
		accessorKey: 'owner',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Owner' />
	},
	{
		accessorKey: 'legalEntities',
		header: 'Legal Entities',
		cell: ({ row }) => {
			const value = row.getValue('legalEntities') as string[]
			if (Array.isArray(value)) {
				return <div className='flex flex-wrap gap-1'>{value.join(', ')}</div>
			}
			return <div>{`${value}`}</div>
		},
		filterFn: (row, id, value) => {
			const array = row.getValue(id) as string[]
			if (typeof value === 'string') return array.includes(value)
			if (Array.isArray(value)) return value.some(i => array.includes(i))
			return false
		}
	},
	{
		accessorKey: 'riskRating',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Risk Rating' />,
		cell: ({ row }) => {
			const value = row.getValue('riskRating') as 'high' | 'medium' | 'low'
			return (
				<Badge variant='default' className={riskRatingColors[value].badge}>
					{value.toUpperCase()}
				</Badge>
			)
		},
		filterFn: (row, id, value) => {
			const rowValue = row.getValue(id) as string
			if (typeof value === 'string') return value === rowValue
			if (Array.isArray(value)) return value.includes(rowValue)
			return false
		}
	},
	{
		accessorKey: 'lastUpdated',
		header: ({ column }) => <DataTableColumnHeader column={column} title='Last Updated' />,
		cell: ({ row }) => {
			const value = row.getValue('lastUpdated')
			return (
				<div className='text-xs text-muted-foreground' suppressHydrationWarning>
					{format(new Date(`${value}`), 'LLL dd, y')}
				</div>
			)
		},
		filterFn: (row, id, value) => {
			const rowValue = row.getValue(id) as Date
			if (value instanceof Date && rowValue instanceof Date) {
				return isSameDay(value, rowValue)
			}
			if (Array.isArray(value)) {
				if (isArrayOfDates(value) && rowValue instanceof Date) {
					const sorted = value.sort((a, b) => a.getTime() - b.getTime())
					return sorted[0]?.getTime() <= rowValue.getTime() && rowValue.getTime() <= sorted[1]?.getTime()
				}
			}
			return false
		}
	}
]
