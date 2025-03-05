import { z } from 'zod'

// Define validation schemas for different SQL types
export const createColumnSchema = (type: string) => {
	switch (type.toLowerCase()) {
		case 'int4':
		case 'integer':
			return z
				.string()
				.refine(val => !isNaN(Number(val)), {
					message: 'Must be a valid integer'
				})
				.transform(val => Number(val))

		case 'uuid':
			return z.string().uuid({
				message: 'Must be a valid UUID'
			})

		case 'timestamp':
			return z.string().datetime({
				message: 'Must be a valid timestamp'
			})

		case 'boolean':
			return z
				.string()
				.transform(val => val.toLowerCase())
				.refine(val => ['true', 'false', '1', '0'].includes(val), {
					message: 'Must be a valid boolean value'
				})
				.transform(val => ['true', '1'].includes(val))

		case 'text':
		default:
			return z.string()
	}
}

// Validate a single value against a column type
export const validateColumnValue = (value: string, type: string) => {
	const schema = createColumnSchema(type)
	try {
		schema.parse(value)
		return { success: true, error: null }
	} catch (error) {
		if (error instanceof z.ZodError) {
			return { success: false, error: error.errors[0].message }
		}
		return { success: false, error: 'Invalid value' }
	}
}
