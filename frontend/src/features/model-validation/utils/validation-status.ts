import { ModelRiskTier } from '@/features/tables/risk-tiers-api'
import { addMonths, addYears, isBefore, parseISO } from 'date-fns'

export type ValidationStatusType = 'overdue' | 'coming' | 'normal'

export interface ValidationStatusInfo {
	type: ValidationStatusType
	message: string
}

// For testing purposes, we're using a fixed date
const CURRENT_DATE = new Date('2025-03-14')

export function calculateValidationStatus(
	lastValidationDate: string,
	nextValidationDate: string,
	riskTierConfig: ModelRiskTier
): ValidationStatusInfo {
	const nextValidation = parseISO(nextValidationDate)

	// If next validation date has passed, it's overdue
	if (isBefore(nextValidation, CURRENT_DATE)) {
		return {
			type: 'overdue',
			message: '(Overdue)'
		}
	}

	// Calculate the alert threshold date
	const monthsUntilValidation = (nextValidation.getTime() - CURRENT_DATE.getTime()) / (30 * 24 * 60 * 60 * 1000)

	// If months until validation is less than alert_threshold, it's coming
	if (monthsUntilValidation <= riskTierConfig.alert_threshold) {
		return {
			type: 'coming',
			message: '(Coming)'
		}
	}

	// Otherwise it's normal
	return {
		type: 'normal',
		message: ''
	}
}
