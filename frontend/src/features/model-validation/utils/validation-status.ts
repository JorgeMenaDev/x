import { ModelRiskTier } from '@/features/tables/risk-tiers-api'
import { addMonths, addYears, isBefore, parseISO } from 'date-fns'

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
	const lastValidation = parseISO(lastValidationDate)

	// Calculate when the next validation should actually be based on validation_frequency
	const expectedNextValidation = addYears(lastValidation, riskTierConfig.validation_frequency)

	// If the provided next validation date doesn't match the expected one (considering validation_frequency)
	// we should not show any alerts
	if (nextValidation.getTime() !== expectedNextValidation.getTime()) {
		return {
			type: 'normal',
			message: ''
		}
	}

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
