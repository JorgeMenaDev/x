import { z } from 'zod'
import type { TableColumn } from '@/features/tables/types'

// Helper function to create a Zod schema based on column type
export function createColumnSchema(column: TableColumn) {
	let schema: z.ZodTypeAny

	switch (column.type.toLowerCase()) {
		case 'text':
			schema = z.string()
			break
		case 'datetime':
			schema = z.string().datetime()
			break
		case 'number':
			schema = z.number()
			break
		case 'boolean':
			schema = z.boolean()
			break
		default:
			schema = z.any()
	}

	// Make the schema nullable if the column is nullable
	if (column.nullable) {
		schema = schema.nullable()
	}

	return schema
}

// Create a dynamic schema for a table based on its columns
export function createTableSchema(columns: TableColumn[]) {
	const schemaMap: Record<string, z.ZodTypeAny> = {}

	columns.forEach(column => {
		schemaMap[column.name] = createColumnSchema(column)
	})

	return z.object(schemaMap)
}

// Validate a single field value
export function validateField(value: unknown, column: TableColumn): { success: boolean; error?: string } {
	try {
		const schema = createColumnSchema(column)
		schema.parse(value)
		return { success: true }
	} catch (error) {
		if (error instanceof z.ZodError) {
			return { success: false, error: error.errors[0].message }
		}
		return { success: false, error: 'Invalid value' }
	}
}

// Check if a field is editable
export function isFieldEditable(column: TableColumn): boolean {
	return !column.isPrimary // Primary key fields are not editable
}
