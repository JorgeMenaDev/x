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

interface InsertRowDrawerProps {
	isOpen: boolean
	onClose: () => void
	columns: TableColumn[]
	selectedTable: string
	onSubmit: (data: any) => void
}

// Helper function to get Zod schema type based on column type
const getZodType = (columnType: string) => {
	switch (columnType) {
		case 'uuid':
			return z.string().uuid()
		case 'text':
			return z.string().min(1, 'This field is required')
		case 'int4':
			return z.number()
		case 'timestamp':
			return z.string().datetime()
		default:
			return z.string()
	}
}

export function InsertRowDrawer({ isOpen, onClose, columns, selectedTable, onSubmit }: InsertRowDrawerProps) {
	// Dynamically create Zod schema based on columns
	const formSchema = z.object(
		columns.reduce(
			(acc, column) => ({
				...acc,
				[column.name]: getZodType(column.type)
			}),
			{}
		)
	)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: columns.reduce(
			(acc, column) => ({
				...acc,
				[column.name]: ''
			}),
			{}
		)
	})

	const handleSubmit = (values: z.infer<typeof formSchema>) => {
		onSubmit(values)
		form.reset()
		onClose()
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
											</FormLabel>
											<FormControl>
												{column.type === 'text' && field.name !== 'id' ? (
													<Textarea {...field} placeholder={`Enter ${column.name}`} />
												) : (
													<Input
														{...field}
														type={column.type === 'int4' ? 'number' : 'text'}
														placeholder={column.type === 'timestamp' ? 'YYYY-MM-DD HH:mm:ss' : `Enter ${column.name}`}
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
