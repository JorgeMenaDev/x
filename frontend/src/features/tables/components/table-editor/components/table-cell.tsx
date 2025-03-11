'use client'

import { EditCell } from './edit-cell'

interface TableCellProps {
	value: string | null
	columnName: string
	onChange: (value: string | null) => void
	onStartEdit: () => void
	onCancelEdit: () => void
	isEditing: boolean
	type?: string
	className?: string
	rowId?: string
}

export function TableCell({
	value,
	columnName,
	onChange,
	onStartEdit,
	onCancelEdit,
	isEditing,
	type = 'text',
	className,
	rowId
}: TableCellProps) {
	const handleDoubleClick = (e: React.MouseEvent) => {
		e.stopPropagation()
		e.preventDefault()

		console.log('Double click on cell:', columnName, 'Row ID type:', typeof rowId, 'Row ID value:', rowId)

		if (!isEditing) {
			onStartEdit()
		}
	}

	return (
		<div
			className={`h-full w-full ${className}`}
			data-column-name={columnName}
			data-row-id={rowId || 'undefined'}
			data-is-editing={isEditing ? 'true' : 'false'}
		>
			{isEditing ? (
				<EditCell
					initialValue={value === null ? '' : String(value)}
					columnName={columnName}
					onSave={onChange}
					onCancel={onCancelEdit}
					type={type}
				/>
			) : (
				<div
					onDoubleClick={handleDoubleClick}
					className='px-2 py-1.5 h-full w-full flex items-center cursor-pointer hover:bg-gray-50 text-xs truncate'
					data-editable='true'
				>
					{value === null ? <span className='text-gray-400 italic text-xs'>NULL</span> : value}
				</div>
			)}
		</div>
	)
}
