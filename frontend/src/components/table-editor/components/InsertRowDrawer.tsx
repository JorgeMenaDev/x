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
import { validateField } from '@/lib/validation/table-schemas'
import { toast } from 'sonner'

interface InsertRowDrawerProps {
	isOpen: boolean
	onClose: () => void
	columns: TableColumn[]
	selectedTable: string
	onSubmit: (data: TableRecord) => void
}

// Helper function to get Zod schema type based on column type
const getZodType = (column: TableColumn) => {
	let schema: z.ZodTypeAny

	switch (column.type.toLowerCase()) {
		case 'uuid':
			schema = z.string().uuid()
			break
		case 'text':
			schema = z.string()
			break
		case 'int4':
			schema = z.number()
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
	}

	return schema
}

export function InsertRowDrawer({ isOpen, onClose, columns, selectedTable, onSubmit }: InsertRowDrawerProps) {
	// Dynamically create Zod schema based on columns
	const formSchema = z.object(
		columns.reduce(
			(acc, column) => ({
				...acc,
				[column.name]: getZodType(column)
			}),
			{}
		)
	)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: columns.reduce(
			(acc, column) => ({
				...acc,
				[column.name]: column.nullable ? null : ''
			}),
			{}
		)
	})

	const handleSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			// Validate each field individually
			for (const column of columns) {
				const value = values[column.name as keyof typeof values]
				const validation = validateField(value, column)
				if (!validation.success) {
					toast.error(`${column.name}: ${validation.error}`)
					return
				}
			}

			// If all validations pass, submit the form
			await onSubmit(values as TableRecord)
			form.reset()
			onClose()
			toast.success('Row inserted successfully')
		} catch (error) {
			toast.error('Failed to insert row')
			console.error('Insert error:', error)
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
							{columns.map(column => (
								<FormField
									key={column.name}
									control={form.control}
									name={column.name}
									render={({ field }) => (
										<FormItem>
											<FormLabel className='flex items-center gap-2'>
												{column.name}
												<span className='text-xs text-muted-foreground'>{column.type}</span>
												{column.nullable && <span className='text-xs text-muted-foreground'>(Optional)</span>}
											</FormLabel>
											<FormControl>
												{column.type === 'text' && field.name !== 'id' ? (
													<Textarea
														{...field}
														value={field.value ?? ''}
														placeholder={`Enter ${column.name}`}
														disabled={column.isPrimary}
													/>
												) : (
													<Input
														{...field}
														value={field.value ?? ''}
														type={column.type === 'int4' ? 'number' : 'text'}
														placeholder={column.type === 'timestamp' ? 'YYYY-MM-DD HH:mm:ss' : `Enter ${column.name}`}
														disabled={column.isPrimary}
													/>
												)}
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							))}

							<DrawerFooter>
								<Button type='submit'>Save</Button>
								<DrawerClose asChild>
									<Button variant='outline'>Cancel</Button>
								</DrawerClose>
							</DrawerFooter>
						</form>
					</Form>
				</div>
			</DrawerContent>
		</Drawer>
	)
}
