import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

// Define risk tier types and their properties
type RiskTier = 'T1' | 'T2' | 'T3' | 'T4' | 'T5'

interface RiskTierConfig {
	label: string
	color: string
	description: string
	validationFrequency: string
}

const riskTierConfigs: Record<RiskTier, RiskTierConfig> = {
	T1: {
		label: 'T1',
		color: 'bg-red-500 hover:bg-red-600',
		description: 'Highest risk tier - Critical models',
		validationFrequency: '1 year'
	},
	T2: {
		label: 'T2',
		color: 'bg-orange-500 hover:bg-orange-600',
		description: 'High risk tier',
		validationFrequency: '1 year'
	},
	T3: {
		label: 'T3',
		color: 'bg-yellow-500 hover:bg-yellow-600',
		description: 'Medium risk tier',
		validationFrequency: '2 years'
	},
	T4: {
		label: 'T4',
		color: 'bg-blue-500 hover:bg-blue-600',
		description: 'Low risk tier',
		validationFrequency: '3 years'
	},
	T5: {
		label: 'T5',
		color: 'bg-green-500 hover:bg-green-600',
		description: 'Lowest risk tier',
		validationFrequency: '3 years'
	}
}

interface ModelRiskTierBadgeProps {
	tier: RiskTier
	showTooltip?: boolean
}

export const ModelRiskTierBadge: React.FC<ModelRiskTierBadgeProps> = ({ tier, showTooltip = true }) => {
	const config = riskTierConfigs[tier]

	const badge = <Badge className={`${config.color} text-white font-medium`}>{config.label}</Badge>

	if (!showTooltip) {
		return badge
	}

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>{badge}</TooltipTrigger>
				<TooltipContent>
					<div className='text-sm'>
						<p className='font-medium'>{config.description}</p>
						<p>Validation frequency: {config.validationFrequency}</p>
					</div>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
