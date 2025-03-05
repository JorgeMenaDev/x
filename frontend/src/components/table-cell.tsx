'use client'

import { EditCell } from './edit-cell'

interface TableCellProps {
	value: string | null
	onChange: (value: string | null) => void
	onStartEdit: () => void
	onCancelEdit: () => void
	isEditing: boolean
	type?: string
	className?: string
}

export function TableCell({
	value,
	onChange,
	onStartEdit,
	onCancelEdit,
	isEditing,
	type = 'text',
	className
}: TableCellProps) {
	const handleDoubleClick = () => {
		onStartEdit()
	}

	return (
		<div className={`h-full w-full ${className}`}>
			{isEditing ? (
				<EditCell
					initialValue={value === null ? '' : String(value)}
					onSave={onChange}
					onCancel={onCancelEdit}
					type={type}
				/>
			) : (
				<div
					onDoubleClick={handleDoubleClick}
					className='px-2 py-1.5 h-full w-full flex items-center cursor-pointer hover:bg-gray-50 text-xs truncate'
				>
					{value === null ? <span className='text-gray-400 italic text-xs'>NULL</span> : value}
				</div>
			)}
		</div>
	)
}
