'use client'

import { useState } from 'react'
import {
	useTableData,
	useCreateTableRow,
	useUpdateTableRow,
	useDeleteTableRow
} from '../../hooks/inventory/tables/use-table-data'
import { QmPurpose } from '../../models/inventory/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Plus, Trash2, Edit, Save, X } from 'lucide-react'

const TABLE_NAME = 'qm_purpose'

export function QmPurposeTable() {
	const [page, setPage] = useState(1)
	const [limit] = useState(10)
	const [newText, setNewText] = useState('')
	const [editingId, setEditingId] = useState<string | null>(null)
	const [editText, setEditText] = useState('')

	// Fetch qm_purpose records
	const { data, isLoading, isError } = useTableData<QmPurpose>(TABLE_NAME, { page, limit })

	// Mutations
	const createRow = useCreateTableRow<QmPurpose>(TABLE_NAME, { showSuccessToast: true })
	const updateRow = useUpdateTableRow<QmPurpose>(TABLE_NAME, { showSuccessToast: true })
	const deleteRow = useDeleteTableRow(TABLE_NAME, { showSuccessToast: true })

	// Handle create
	const handleCreate = () => {
		if (newText.trim()) {
			createRow.mutate({ data: { text: newText.trim() } })
			setNewText('')
		}
	}

	// Handle update
	const handleUpdate = (id: string) => {
		if (editText.trim()) {
			updateRow.mutate({ id, data: { text: editText.trim() } })
			setEditingId(null)
			setEditText('')
		}
	}

	// Handle delete
	const handleDelete = (id: string) => {
		if (confirm('Are you sure you want to delete this record?')) {
			deleteRow.mutate(id)
		}
	}

	// Start editing
	const startEditing = (id: string, text: string) => {
		setEditingId(id)
		setEditText(text)
	}

	// Cancel editing
	const cancelEditing = () => {
		setEditingId(null)
		setEditText('')
	}

	if (isLoading) {
		return (
			<div className='flex items-center justify-center h-40'>
				<Loader2 className='h-8 w-8 animate-spin text-primary' />
				<span className='ml-2'>Loading records...</span>
			</div>
		)
	}

	if (isError) {
		return <div className='p-4 text-red-500'>Error loading records. Please try again.</div>
	}

	return (
		<div className='space-y-4'>
			<h2 className='text-2xl font-bold'>QM Purpose Records</h2>

			{/* Create form */}
			<div className='flex gap-2'>
				<Input
					placeholder='Enter new purpose...'
					value={newText}
					onChange={e => setNewText(e.target.value)}
					className='flex-1'
				/>
				<Button onClick={handleCreate} disabled={!newText.trim() || createRow.isPending}>
					{createRow.isPending ? <Loader2 className='h-4 w-4 animate-spin mr-2' /> : <Plus className='h-4 w-4 mr-2' />}
					Add
				</Button>
			</div>

			{/* Records table */}
			<div className='border rounded-md'>
				<table className='w-full'>
					<thead>
						<tr className='border-b'>
							<th className='px-4 py-2 text-left'>ID</th>
							<th className='px-4 py-2 text-left'>Text</th>
							<th className='px-4 py-2 text-left'>Created At</th>
							<th className='px-4 py-2 text-left'>Updated At</th>
							<th className='px-4 py-2 text-right'>Actions</th>
						</tr>
					</thead>
					<tbody>
						{data?.data.map(record => (
							<tr key={record.id} className='border-b'>
								<td className='px-4 py-2 font-mono text-xs'>{record.id}</td>
								<td className='px-4 py-2'>
									{editingId === record.id ? (
										<Input value={editText} onChange={e => setEditText(e.target.value)} className='w-full' />
									) : (
										record.text
									)}
								</td>
								<td className='px-4 py-2 text-sm text-gray-500'>{new Date(record.created_at).toLocaleString()}</td>
								<td className='px-4 py-2 text-sm text-gray-500'>{new Date(record.updated_at).toLocaleString()}</td>
								<td className='px-4 py-2 text-right'>
									{editingId === record.id ? (
										<div className='flex justify-end gap-1'>
											<Button
												size='sm'
												variant='ghost'
												onClick={() => handleUpdate(record.id)}
												disabled={updateRow.isPending}
											>
												{updateRow.isPending ? (
													<Loader2 className='h-4 w-4 animate-spin' />
												) : (
													<Save className='h-4 w-4' />
												)}
											</Button>
											<Button size='sm' variant='ghost' onClick={cancelEditing}>
												<X className='h-4 w-4' />
											</Button>
										</div>
									) : (
										<div className='flex justify-end gap-1'>
											<Button size='sm' variant='ghost' onClick={() => startEditing(record.id, record.text)}>
												<Edit className='h-4 w-4' />
											</Button>
											<Button
												size='sm'
												variant='ghost'
												className='text-red-500 hover:text-red-700'
												onClick={() => handleDelete(record.id)}
												disabled={deleteRow.isPending}
											>
												{deleteRow.isPending && deleteRow.variables === record.id ? (
													<Loader2 className='h-4 w-4 animate-spin' />
												) : (
													<Trash2 className='h-4 w-4' />
												)}
											</Button>
										</div>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Pagination */}
			<div className='flex justify-between items-center'>
				<div>Total: {data?.total || 0} records</div>
				<div className='flex gap-2'>
					<Button variant='outline' size='sm' onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
						Previous
					</Button>
					<Button
						variant='outline'
						size='sm'
						onClick={() => setPage(p => p + 1)}
						disabled={!data || data.data.length < limit}
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	)
}
