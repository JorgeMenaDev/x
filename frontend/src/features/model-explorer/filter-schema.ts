import { z } from 'zod'
import { ARRAY_DELIMITER, RANGE_DELIMITER } from '@/features/default-table/lib/delimiters'
import { MODEL_PURPOSES, MODEL_TYPES, RISK_RATINGS } from './constants'

// String to boolean conversion helper
const stringToBoolean = z
	.string()
	.toLowerCase()
	.transform(val => {
		try {
			return JSON.parse(val)
		} catch (e) {
			console.log(e)
			return undefined
		}
	})
	.pipe(z.boolean().optional())

// Define a schema for filtering in the command search box
export const modelFilterSchema = z.object({
	id: z.string().optional(),
	name: z.string().optional(),
	type: z
		.string()
		.transform(val => val.split(ARRAY_DELIMITER))
		.pipe(z.enum(MODEL_TYPES).array())
		.optional(),
	purpose: z
		.string()
		.transform(val => val.split(ARRAY_DELIMITER))
		.pipe(z.enum(MODEL_PURPOSES).array())
		.optional(),
	owner: z.string().optional(),
	legalEntities: z
		.string()
		.transform(val => val.split(ARRAY_DELIMITER))
		.pipe(z.string().array())
		.optional(),
	riskRating: z
		.string()
		.transform(val => val.split(ARRAY_DELIMITER))
		.pipe(z.enum(RISK_RATINGS).array())
		.optional(),
	lastUpdated: z
		.string()
		.transform(val => val.split(RANGE_DELIMITER).map(Number))
		.pipe(z.coerce.date().array())
		.optional()
})
