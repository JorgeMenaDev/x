'use client'

import type React from 'react'
import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface EditCellProps {
	initialValue: string
	onSave: (value: string | null) => void
	onCancel: () => void
	className?: string
}

export function EditCell({ initialValue, onSave, onCancel, className }: EditCellProps) {
	const [value, setValue] = useState(initialValue)
	const textareaRef = useRef<HTMLTextAreaElement>(null)
	const containerRef = useRef<HTMLDivElement>(null)

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
				onCancel()
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [onCancel])

	const handleSave = () => {
		onSave(value)
	}

	const handleSetNull = () => {
		onSave(null)
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Escape') {
			e.preventDefault()
			onCancel()
		} else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
			e.preventDefault()
			handleSave()
		}
	}

	return (
		<div ref={containerRef} className={`bg-gray-50 p-2 ${className}`}>
			<Textarea
				ref={textareaRef}
				value={value}
				onChange={e => setValue(e.target.value)}
				onKeyDown={handleKeyDown}
				className='min-h-[80px] mb-2 w-full bg-white border-gray-200'
			/>
			<div className='flex flex-col gap-2'>
				<div className='flex gap-2'>
					<Button size='sm' variant='outline' onClick={handleSave} className='flex items-center gap-1 h-7 px-2 text-xs'>
						<span className='text-xs'>↩</span> Save changes
					</Button>
					<Button size='sm' variant='outline' onClick={onCancel} className='flex items-center gap-1 h-7 px-2 text-xs'>
						<span className='text-xs'>Esc</span> Cancel changes
					</Button>
				</div>
				<Button size='sm' variant='outline' onClick={handleSetNull} className='h-7 px-2 text-xs'>
					Set to NULL
				</Button>
			</div>
		</div>
	)
}
