import {
	createSearchParamsCache,
	parseAsArrayOf,
	parseAsString,
	parseAsTimestamp,
	parseAsStringLiteral
} from 'nuqs/server'
import { ARRAY_DELIMITER, RANGE_DELIMITER } from '@/features/default-table/lib/delimiters'
import { MODEL_PURPOSES, MODEL_TYPES, RISK_RATINGS } from './constants'

// Create parsers that match the default-table's format
export const searchParamsParser = {
	id: parseAsString,
	name: parseAsString,
	type: parseAsArrayOf(parseAsStringLiteral(MODEL_TYPES), ARRAY_DELIMITER),
	purpose: parseAsArrayOf(parseAsStringLiteral(MODEL_PURPOSES), ARRAY_DELIMITER),
	owner: parseAsString,
	legalEntities: parseAsArrayOf(parseAsString, ARRAY_DELIMITER),
	riskRating: parseAsArrayOf(parseAsStringLiteral(RISK_RATINGS), ARRAY_DELIMITER),
	lastUpdated: parseAsArrayOf(parseAsTimestamp, RANGE_DELIMITER)
}

export const searchParamsCache = createSearchParamsCache(searchParamsParser)
