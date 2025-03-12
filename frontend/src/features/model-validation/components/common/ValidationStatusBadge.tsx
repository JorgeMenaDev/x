import React from 'react'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Clock, AlertTriangle, XCircle } from 'lucide-react'

// Define validation status types
export type ValidationStatus = 'due' | 'in-progress' | 'approved' | 'approved-with-conditions' | 'declined' | 'pending'

interface ValidationStatusConfig {
	label: string
	color: string
	icon: React.ReactNode
}

const statusConfigs: Record<ValidationStatus, ValidationStatusConfig> = {
	due: {
		label: 'Validation Due',
		color: 'bg-amber-500 hover:bg-amber-600',
		icon: <Clock className='mr-1 h-3 w-3' />
	},
	'in-progress': {
		label: 'In Progress',
		color: 'bg-blue-500 hover:bg-blue-600',
		icon: <Clock className='mr-1 h-3 w-3' />
	},
	approved: {
		label: 'Approved',
		color: 'bg-green-500 hover:bg-green-600',
		icon: <CheckCircle2 className='mr-1 h-3 w-3' />
	},
	'approved-with-conditions': {
		label: 'Approved with Conditions',
		color: 'bg-yellow-500 hover:bg-yellow-600',
		icon: <AlertTriangle className='mr-1 h-3 w-3' />
	},
	declined: {
		label: 'Declined',
		color: 'bg-red-500 hover:bg-red-600',
		icon: <XCircle className='mr-1 h-3 w-3' />
	},
	pending: {
		label: 'Pending',
		color: 'bg-gray-400 hover:bg-gray-500',
		icon: <Clock className='mr-1 h-3 w-3' />
	}
}

interface ValidationStatusBadgeProps {
	status: ValidationStatus
	className?: string
}

export const ValidationStatusBadge: React.FC<ValidationStatusBadgeProps> = ({ status, className = '' }) => {
	const config = statusConfigs[status]

	return (
		<Badge className={`${config.color} text-white font-medium flex items-center ${className}`}>
			{config.icon}
			{config.label}
		</Badge>
	)
}
