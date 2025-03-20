import { subDays } from 'date-fns'

export const RISK_RATINGS = ['high', 'medium', 'low'] as const
export const MODEL_TYPES = ['Model', 'DQM in scope', 'Other'] as const
export const MODEL_PURPOSES = ['Credit', 'Market', 'Operational', 'Other'] as const

export const riskRatingColors = {
	high: {
		badge: 'text-destructive bg-destructive/10 border-destructive/20 hover:bg-destructive/10',
		dot: 'bg-destructive'
	},
	medium: {
		badge: 'text-[#f97316] bg-[#f97316]/10 border-[#f97316]/20 hover:bg-[#f97316]/10',
		dot: 'bg-[#f97316]'
	},
	low: {
		badge: 'text-[#10b981] bg-[#10b981]/10 border-[#10b981]/20 hover:bg-[#10b981]/10',
		dot: 'bg-[#10b981]'
	}
} as const

export const modelData = [
	{
		id: 'MDL001',
		name: 'Credit Risk Assessment',
		type: 'Model',
		purpose: 'Credit',
		owner: 'Jane Smith',
		ownerInputter: 'John Doe',
		legalEntities: ['LE1', 'LE2'],
		riskRating: 'high',
		lastUpdated: subDays(new Date(), 15)
	},
	{
		id: 'MDL002',
		name: 'Loan Pricing Model',
		type: 'Model',
		purpose: 'Credit',
		owner: 'Robert Johnson',
		ownerInputter: 'Sarah Williams',
		legalEntities: ['LE1'],
		riskRating: 'medium',
		lastUpdated: subDays(new Date(), 32)
	},
	{
		id: 'MDL003',
		name: 'Portfolio Risk Model',
		type: 'Model',
		purpose: 'Market',
		owner: 'Michael Brown',
		ownerInputter: 'Emily Davis',
		legalEntities: ['LE1', 'LE2'],
		riskRating: 'high',
		lastUpdated: subDays(new Date(), 5)
	},
	{
		id: 'MDL004',
		name: 'Customer Offer Generator',
		type: 'DQM in scope',
		purpose: 'Credit',
		owner: 'Lisa Anderson',
		ownerInputter: 'David Wilson',
		legalEntities: ['LE1'],
		riskRating: 'low',
		lastUpdated: subDays(new Date(), 20)
	},
	{
		id: 'MDL005',
		name: 'Operational Risk Assessment',
		type: 'Model',
		purpose: 'Operational',
		owner: 'Mark Thompson',
		ownerInputter: 'Jessica Miller',
		legalEntities: ['LE2'],
		riskRating: 'medium',
		lastUpdated: subDays(new Date(), 12)
	},
	{
		id: 'MDL006',
		name: 'Market Stress Test',
		type: 'Model',
		purpose: 'Market',
		owner: 'Chris Wilson',
		ownerInputter: 'Amanda Clark',
		legalEntities: ['LE1', 'LE2', 'LE3'],
		riskRating: 'high',
		lastUpdated: subDays(new Date(), 8)
	},
	{
		id: 'MDL007',
		name: 'Fraud Detection System',
		type: 'DQM in scope',
		purpose: 'Operational',
		owner: 'Eric Johnson',
		ownerInputter: 'Susan White',
		legalEntities: ['LE1'],
		riskRating: 'high',
		lastUpdated: subDays(new Date(), 2)
	},
	{
		id: 'MDL008',
		name: 'Customer Churn Predictor',
		type: 'Model',
		purpose: 'Other',
		owner: 'Kevin Taylor',
		ownerInputter: 'Rachel Green',
		legalEntities: ['LE3'],
		riskRating: 'low',
		lastUpdated: subDays(new Date(), 45)
	}
]

export const filterFields = [
	{
		label: 'Time Range',
		value: 'lastUpdated',
		type: 'timerange',
		defaultOpen: true,
		commandDisabled: true
	},
	{
		label: 'Risk Rating',
		value: 'riskRating',
		type: 'checkbox',
		options: RISK_RATINGS.map(rating => ({
			label: rating.charAt(0).toUpperCase() + rating.slice(1),
			value: rating
		}))
	},
	{
		label: 'Type',
		value: 'type',
		type: 'checkbox',
		options: MODEL_TYPES.map(type => ({
			label: type,
			value: type
		}))
	},
	{
		label: 'Purpose',
		value: 'purpose',
		type: 'checkbox',
		options: MODEL_PURPOSES.map(purpose => ({
			label: purpose,
			value: purpose
		}))
	},
	{
		label: 'Legal Entity',
		value: 'legalEntities',
		type: 'checkbox',
		options: [
			{ label: 'LE1', value: 'LE1' },
			{ label: 'LE2', value: 'LE2' },
			{ label: 'LE3', value: 'LE3' }
		]
	}
]
