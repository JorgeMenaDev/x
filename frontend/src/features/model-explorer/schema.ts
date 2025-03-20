import { z } from 'zod'
import { ARRAY_DELIMITER, RANGE_DELIMITER } from '@/features/default-table/lib/delimiters'
import { MODEL_PURPOSES, MODEL_TYPES, RISK_RATINGS } from './constants'

// Create a type-safe schema for our model data
export const modelSchema = z.object({
	id: z.string(),
	name: z.string(),
	type: z.enum(MODEL_TYPES),
	purpose: z.enum(MODEL_PURPOSES),
	owner: z.string(),
	ownerInputter: z.string(),
	legalEntities: z.string().array(),
	riskRating: z.enum(RISK_RATINGS),
	lastUpdated: z.date()
})

export type ModelSchema = z.infer<typeof modelSchema>

// String to boolean conversion helper for filter schema
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

// Schema for filtering models
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

export type ModelFilterSchema = z.infer<typeof modelFilterSchema>
