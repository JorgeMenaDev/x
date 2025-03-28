import * as React from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { PlusCircle, Trash2 } from 'lucide-react'
import { useSeparateModelReferenceData } from '../hooks/use-model-reference-data'
import { useAssetClassFilter } from '../hooks/use-asset-class-filter'
import { useUseFilter } from '../hooks/use-use-filter'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'

// Define the form schema for model uses
const modelUseSchema = z.object({
	modelUses: z
		.array(
			z.object({
				subgroup: z.string().min(1, 'Subgroup is required'),
				use: z.string().min(1, 'Use is required'),
				assetClass: z.string().min(1, 'Asset class is required'),
				execUsage: z.string().min(1, 'Executive usage is required'),
				user: z.string().min(1, 'User is required')
			})
		)
		.min(1, 'At least one model use configuration is required')
})

interface AddModelUseDialogProps {
	modelId: string // The ID of the model to add uses to
	open: boolean
	onOpenChange: (open: boolean) => void
}

export function AddModelUseDialog({ modelId, open, onOpenChange }: AddModelUseDialogProps) {
	const { data: modelReferenceData, isLoading } = useSeparateModelReferenceData()
	const [purposeValue, setPurposeValue] = React.useState('')

	// Initialize the form
	const form = useForm<z.infer<typeof modelUseSchema>>({
		resolver: zodResolver(modelUseSchema),
		defaultValues: {
			modelUses: [
				{
					subgroup: '',
					use: '',
					assetClass: '',
					execUsage: '',
					user: ''
				}
			]
		}
	})

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: 'modelUses'
	})

	// Use the hooks to filter asset classes and uses based on the selected purpose
	const filteredAssetClasses = useAssetClassFilter(modelReferenceData, purposeValue)
	const filteredUses = useUseFilter(modelReferenceData, purposeValue)

	// Handle form submission
	const onSubmit = async (values: z.infer<typeof modelUseSchema>) => {
		try {
			// TODO: Implement the API call to add model uses
			console.log('Adding model uses:', values)
			onOpenChange(false)
			form.reset()
		} catch (error) {
			console.error('Error adding model uses:', error)
		}
	}

	if (isLoading) {
		return null
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='max-w-[1400px] min-w-[50%] w-full rounded-lg bg-white p-8 dark:bg-gray-950 max-h-[80vh] overflow-auto mx-4 sm:mx-6 md:mx-8 lg:mx-10'>
				<DialogHeader>
					<DialogTitle>Add Model Uses</DialogTitle>
					<DialogDescription>Add new uses to the existing model. You can add multiple uses at once.</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
						<div>
							<div className='flex items-center justify-between mb-4'>
								<h3 className='text-lg font-medium'>Model Uses</h3>
								<Button
									type='button'
									variant='outline'
									size='sm'
									onClick={() =>
										append({
											subgroup: '',
											use: '',
											assetClass: '',
											execUsage: '',
											user: ''
										})
									}
									className='text-primary'
								>
									<PlusCircle className='mr-2 h-4 w-4' />
									Add Use
								</Button>
							</div>

							{fields.map((field, index) => (
								<div key={field.id} className='p-4 border rounded-md mb-4 bg-gray-50'>
									<div className='flex justify-between items-center mb-4'>
										<h4 className='font-medium'>Use Configuration {index + 1}</h4>
										{index > 0 && (
											<Button
												type='button'
												variant='ghost'
												size='sm'
												onClick={() => remove(index)}
												className='text-red-500 hover:text-red-700'
											>
												<Trash2 className='h-4 w-4' />
											</Button>
										)}
									</div>

									<div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
										<FormField
											control={form.control}
											name={`modelUses.${index}.subgroup`}
											render={({ field }) => (
												<FormItem>
													<FormLabel>Subgroup</FormLabel>
													<Select onValueChange={field.onChange} defaultValue={field.value}>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder='Select subgroup' />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{modelReferenceData?.Subgroup.map(subgroup => (
																<SelectItem key={subgroup.subgroup_id} value={subgroup.subgroup_id.toString()}>
																	{subgroup.subgroup}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name={`modelUses.${index}.use`}
											render={({ field }) => (
												<FormItem>
													<FormLabel>Use</FormLabel>
													<Select onValueChange={field.onChange} defaultValue={field.value}>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder='Select use' />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{Array.isArray(filteredUses) && filteredUses.length > 0
																? filteredUses.map((use: { use_id: number; use: string }) => (
																		<SelectItem key={use.use_id} value={use.use_id.toString()}>
																			{use.use}
																		</SelectItem>
																  ))
																: modelReferenceData?.Uses?.map((use: { use_id: number; use: string }) => (
																		<SelectItem key={use.use_id} value={use.use_id.toString()}>
																			{use.use}
																		</SelectItem>
																  ))}
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name={`modelUses.${index}.assetClass`}
											render={({ field }) => (
												<FormItem>
													<FormLabel>Asset Class</FormLabel>
													<Select onValueChange={field.onChange} defaultValue={field.value}>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder='Select asset class' />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{Array.isArray(filteredAssetClasses) && filteredAssetClasses.length > 0
																? filteredAssetClasses.map((asset: { assetclass_id: number; assetclass: string }) => (
																		<SelectItem key={asset.assetclass_id} value={asset.assetclass_id.toString()}>
																			{asset.assetclass}
																		</SelectItem>
																  ))
																: modelReferenceData?.AssetClass?.map(
																		(asset: { assetclass_id: number; assetclass: string }) => (
																			<SelectItem key={asset.assetclass_id} value={asset.assetclass_id.toString()}>
																				{asset.assetclass}
																			</SelectItem>
																		)
																  )}
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
										<FormField
											control={form.control}
											name={`modelUses.${index}.execUsage`}
											render={({ field }) => (
												<FormItem>
													<FormLabel>Accountable Exec Usage</FormLabel>
													<FormControl>
														<Input {...field} placeholder='Enter executive usage code' />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name={`modelUses.${index}.user`}
											render={({ field }) => (
												<FormItem>
													<FormLabel>User</FormLabel>
													<FormControl>
														<Input {...field} placeholder='Enter user' />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</div>
							))}
						</div>

						<div className='flex justify-end gap-4'>
							<Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
								Cancel
							</Button>
							<Button type='submit'>Add Uses</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
