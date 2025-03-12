import React from 'react'
import { format, isAfter, isBefore, addMonths } from 'date-fns'
import { Calendar } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface ValidationDateDisplayProps {
	date: Date | string | null
	type: 'last' | 'next' | 'due'
	showIcon?: boolean
	className?: string
}

export const ValidationDateDisplay: React.FC<ValidationDateDisplayProps> = ({
	date,
	type,
	showIcon = true,
	className = ''
}) => {
	if (!date) {
		return <span className='text-muted-foreground'>Not available</span>
	}

	const dateObj = typeof date === 'string' ? new Date(date) : date
	const formattedDate = format(dateObj, 'dd/MM/yyyy')
	const today = new Date()

	// Determine status for coloring
	let statusColor = 'text-foreground'
	let statusText = ''

	if (type === 'due' || type === 'next') {
		// If due date is within 3 months, show warning
		const warningThreshold = addMonths(today, 3)

		if (isBefore(dateObj, today)) {
			statusColor = 'text-red-500 font-medium'
			statusText = 'Overdue'
		} else if (isBefore(dateObj, warningThreshold)) {
			statusColor = 'text-amber-500 font-medium'
			statusText = 'Due soon'
		}
	}

	const displayElement = (
		<div className={`flex items-center gap-1.5 ${statusColor} ${className}`}>
			{showIcon && <Calendar className='h-4 w-4' />}
			<span>{formattedDate}</span>
			{statusText && <span className='ml-1.5'>({statusText})</span>}
		</div>
	)

	// Add tooltip for due dates
	if (type === 'due' && statusText) {
		return (
			<TooltipProvider>
				<Tooltip>
					<TooltipTrigger asChild>{displayElement}</TooltipTrigger>
					<TooltipContent>
						<p>
							{statusText === 'Overdue'
								? 'Validation is overdue and needs immediate attention'
								: 'Validation will be due soon'}
						</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		)
	}

	return displayElement
}
