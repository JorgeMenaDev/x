import React from 'react'
import { format, parseISO } from 'date-fns'
import { ModelRiskTier } from '@/features/tables/risk-tiers-api'
import { calculateValidationStatus } from '../../utils/validation-status'

interface ValidationDateDisplayProps {
	date: string
	type: 'last' | 'due'
	riskTierConfig?: ModelRiskTier
	lastValidationDate?: string
}

export const ValidationDateDisplay: React.FC<ValidationDateDisplayProps> = ({
	date,
	type,
	riskTierConfig,
	lastValidationDate
}) => {
	const formattedDate = format(parseISO(date), 'dd/MM/yyyy')

	if (type === 'last') {
		return <span>{formattedDate}</span>
	}

	// Only calculate status for 'due' dates and if we have the risk tier config
	if (type === 'due' && riskTierConfig && lastValidationDate) {
		const status = calculateValidationStatus(lastValidationDate, date, riskTierConfig)

		return (
			<div className='flex items-center gap-2'>
				<span>{formattedDate}</span>
			</div>
		)
	}

	return <span>{formattedDate}</span>
}
