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
	id: parseAsString.withDefault(''),
	name: parseAsString.withDefault(''),
	type: parseAsArrayOf(parseAsStringLiteral(MODEL_TYPES), ARRAY_DELIMITER).withDefault([]),
	purpose: parseAsArrayOf(parseAsStringLiteral(MODEL_PURPOSES), ARRAY_DELIMITER).withDefault([]),
	owner: parseAsString.withDefault(''),
	legalEntities: parseAsArrayOf(parseAsString, ARRAY_DELIMITER).withDefault([]),
	riskRating: parseAsArrayOf(parseAsStringLiteral(RISK_RATINGS), ARRAY_DELIMITER).withDefault([]),
	lastUpdated: parseAsArrayOf(parseAsTimestamp, RANGE_DELIMITER).withDefault([])
}

export const searchParamsCache = createSearchParamsCache(searchParamsParser)
