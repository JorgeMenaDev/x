import { ModelRiskTier } from '@/features/tables/risk-tiers-api'
import { addMonths, isAfter, isBefore, parseISO } from 'date-fns'

export type ValidationStatusType = 'overdue' | 'coming' | 'normal'

export interface ValidationStatusInfo {
	type: ValidationStatusType
	message: string
}

export function calculateValidationStatus(
	lastValidationDate: string,
	nextValidationDate: string,
	riskTierConfig: ModelRiskTier
): ValidationStatusInfo {
	const currentDate = new Date()
	const nextValidation = parseISO(nextValidationDate)

	// If next validation date has passed, it's overdue
	if (isBefore(nextValidation, currentDate)) {
		return {
			type: 'overdue',
			message: '(Overdue)'
		}
	}

	// Calculate the alert threshold date
	const alertThresholdDate = addMonths(currentDate, riskTierConfig.alert_threshold)

	// If next validation is within the alert threshold, it's coming
	if (isBefore(nextValidation, alertThresholdDate)) {
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
