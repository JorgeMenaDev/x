'use client'

import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import type { TableColumn } from '../types'
import { TableRecord } from '@/models/inventory/table'
import { useState } from 'react'

interface InsertRowDrawerProps {
	isOpen: boolean
	onClose: () => void
	columns: TableColumn[]
	selectedTable: string
	onSubmit: (data: TableRecord) => Promise<void>
}

// Helper function to get Zod schema type based on column type
const getZodType = (column: TableColumn) => {
	let schema: z.ZodTypeAny

	switch (column.type.toLowerCase()) {
		case 'uuid':
			schema = z.string().uuid()
			break
		case 'text':
			schema = z.string().min(1, 'This field is required')
			break
		case 'int4':
			schema = z.coerce.number()
			break
		case 'timestamp':
			schema = z.string().datetime()
			break
		case 'boolean':
			schema = z.boolean()
			break
		default:
			schema = z.string()
	}

	// Make the schema nullable if the column is nullable
	if (column.nullable) {
		schema = schema.nullable()
	} else {
		// For non-nullable fields, ensure they're not empty
		schema = schema.refine(val => {
			if (val === null || val === undefined) return false
			if (typeof val === 'string') return val.trim().length > 0
			if (typeof val === 'number') return true
			return false
		}, 'This field is required')
	}

	return schema
}

export function InsertRowDrawer({ isOpen, onClose, columns, selectedTable, onSubmit }: InsertRowDrawerProps) {
	const [isSubmitting, setIsSubmitting] = useState(false)

	// Dynamically create Zod schema based on columns
	const formSchema = z.object(
		columns.reduce<z.ZodRawShape>(
			(acc, column) => ({
				...acc,
				[column.name]: getZodType(column)
			}),
			{}
		)
	)

	type FormData = z.infer<typeof formSchema>

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: columns.reduce<Partial<FormData>>(
			(acc, column) => ({
				...acc,
				[column.name]: column.nullable ? null : ''
			}),
			{}
		),
		mode: 'onChange' // Enable real-time validation
	})

	const handleSubmit = async (values: FormData) => {
		if (isSubmitting) return

		try {
			setIsSubmitting(true)

			// Clean up the values before submission
			const cleanedValues = Object.entries(values).reduce<Record<string, unknown>>((acc, [key, value]) => {
				const column = columns.find(col => col.name === key)
				if (column?.nullable && (value === '' || value === null)) {
					acc[key] = null
				} else if (typeof value === 'string') {
					acc[key] = value.trim()
				} else {
					acc[key] = value
				}
				return acc
			}, {})

			await onSubmit(cleanedValues as TableRecord)
			form.reset()
			onClose()
		} catch (error) {
			// Error is handled by the parent component
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<Drawer open={isOpen} onOpenChange={onClose}>
			<DrawerContent className='w-full max-w-md border-none'>
				<DrawerHeader>
					<DrawerTitle>Add new row to {selectedTable}</DrawerTitle>
				</DrawerHeader>

				<div className='p-4'>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
							{columns.map(column => {
								const fieldName = column.name as keyof FormData & string
								return (
									<FormField
										key={column.name}
										control={form.control}
										name={fieldName}
										render={({ field }) => (
											<FormItem>
												<FormLabel className='flex items-center gap-2'>
													{column.name}
													<span className='text-xs text-muted-foreground'>{column.type}</span>
													{column.nullable && <span className='text-xs text-muted-foreground'>(Optional)</span>}
													{!column.nullable && <span className='text-xs text-red-500'>*</span>}
												</FormLabel>
												<FormControl>
													{column.type === 'text' && field.name !== 'id' ? (
														<Textarea
															{...field}
															value={String(field.value ?? '')}
															placeholder={`Enter ${column.name}`}
															disabled={column.isPrimary || isSubmitting}
														/>
													) : (
														<Input
															{...field}
															value={String(field.value ?? '')}
															type={column.type === 'int4' ? 'number' : 'text'}
															placeholder={column.type === 'timestamp' ? 'YYYY-MM-DD HH:mm:ss' : `Enter ${column.name}`}
															disabled={column.isPrimary || isSubmitting}
														/>
													)}
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								)
							})}

							<DrawerFooter>
								<Button type='submit' disabled={isSubmitting}>
									{isSubmitting ? 'Saving...' : 'Save'}
								</Button>
								<DrawerClose asChild>
									<Button variant='outline' disabled={isSubmitting}>
										Cancel
									</Button>
								</DrawerClose>
							</DrawerFooter>
						</form>
					</Form>
				</div>
			</DrawerContent>
		</Drawer>
	)
}
