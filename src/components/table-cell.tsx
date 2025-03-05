'use client'

import { EditCell } from './edit-cell'

interface TableCellProps {
	value: string | null
	onChange: (value: string | null) => void
	onStartEdit: () => void
	onCancelEdit: () => void
	isEditing: boolean
	className?: string
}

export function TableCell({ value, onChange, onStartEdit, onCancelEdit, isEditing, className }: TableCellProps) {
	const handleDoubleClick = () => {
		onStartEdit()
	}

	const handleSave = (newValue: string | null) => {
		onChange(newValue)
	}

	return (
		<div className={`w-full h-full ${className}`}>
			{isEditing ? (
				<EditCell initialValue={value || ''} onSave={handleSave} onCancel={onCancelEdit} />
			) : (
				<div onDoubleClick={handleDoubleClick} className='p-2 min-h-[40px] cursor-pointer hover:bg-gray-50'>
					{value === null ? <span className='text-gray-400 italic'>NULL</span> : value}
				</div>
			)}
		</div>
	)
}
