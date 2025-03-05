'use client'

import type React from 'react'
import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { validateColumnValue } from '@/lib/validation'
import { toast } from 'sonner'

interface EditCellProps {
	initialValue: string
	onSave: (value: string | null) => void
	onCancel: () => void
	className?: string
	type?: string
}

export function EditCell({ initialValue, onSave, onCancel, className, type = 'text' }: EditCellProps) {
	const [value, setValue] = useState(initialValue)
	const [error, setError] = useState<string | null>(null)
	const textareaRef = useRef<HTMLTextAreaElement>(null)
	const containerRef = useRef<HTMLDivElement>(null)

	const validate = (val: string): boolean => {
		if (val === '') return true // Allow empty string as it will be converted to NULL
		const result = validateColumnValue(val, type)
		if (!result.success) {
			setError(result.error)
			toast.error(result.error)
			return false
		}
		setError(null)
		return true
	}

	const handleSave = useCallback(() => {
		if (value === '') {
			onSave(null)
			return
		}

		if (!validate(value)) {
			return // Don't save if validation fails
		}
		onSave(value)
	}, [onSave, value, type])

	// Focus the textarea when the component mounts
	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.focus()
			textareaRef.current.select()
		}
	}, [])

	// Handle clicks outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				handleSave()
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [handleSave])

	const handleSetNull = () => {
		onSave(null)
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Escape') {
			e.preventDefault()
			onCancel()
		} else if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			handleSave()
		}
	}

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const newValue = e.target.value
		setValue(newValue)
		// Clear error when user starts typing
		if (error) setError(null)
	}

	return (
		<div ref={containerRef} className={`bg-gray-50 p-1.5 ${className}`}>
			<Textarea
				ref={textareaRef}
				value={value}
				onChange={handleChange}
				onKeyDown={handleKeyDown}
				className={`min-h-[60px] mb-1.5 w-full bg-white text-xs ${error ? 'border-red-500' : 'border-gray-200'}`}
			/>
			{error && <div className='text-red-500 text-[10px] mb-1.5'>{error}</div>}
			<div className='flex gap-1.5 justify-between'>
				<Button size='sm' variant='outline' onClick={handleSetNull} className='h-6 px-2 text-[10px]'>
					Set NULL
				</Button>
				<div className='flex gap-1.5'>
					<Button
						size='sm'
						variant='outline'
						onClick={onCancel}
						className='h-6 px-2 text-[10px] flex items-center gap-1'
					>
						<span className='text-[10px]'>Esc</span> Cancel
					</Button>
					<Button
						size='sm'
						variant='outline'
						onClick={handleSave}
						className='h-6 px-2 text-[10px] flex items-center gap-1'
					>
						<span className='text-[10px]'>↩</span> Save
					</Button>
				</div>
			</div>
		</div>
	)
}
