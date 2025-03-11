'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFieldArray } from 'react-hook-form'
import * as z from 'zod'
import { PlusCircle, Trash2, Loader2 } from 'lucide-react'
import { useSeparateModelReferenceData } from '../hooks/use-model-reference-data'
import { useAssetClassFilter } from '../hooks/use-asset-class-filter'
import { useUseFilter } from '../hooks/use-use-filter'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

// Define the form schema
const formSchema = z.object({
	uniqueReference: z.string().min(1, 'Unique reference is required'),
	modelName: z.string().min(1, 'Model name is required'),
	modelType: z.string({
		required_error: 'Please select a model type'
	}),
	purpose: z.string({
		required_error: 'Please select a purpose'
	}),
	owner: z.string().min(1, 'Owner is required'),
	accountableExec: z.string().min(1, 'Accountable executive is required'),
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

export default function ModelReferenceForm() {
	// Use the hook to fetch data from the API
	const { data: modelReferenceData, isLoading, isError, error } = useSeparateModelReferenceData()
	const [submitting, setSubmitting] = useState(false)
	const [showConfirmDialog, setShowConfirmDialog] = useState(false)

	// Initialize the form
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			uniqueReference: '',
			modelName: '',
			modelType: '',
			purpose: '',
			owner: '',
			accountableExec: '',
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

	// Get the current purpose value for filtering
	const purposeValue = form.watch('purpose')
	console.log('Current purpose value:', purposeValue)

	// Use the hooks to filter asset classes and uses based on the selected purpose
	const filteredAssetClasses = useAssetClassFilter(modelReferenceData, purposeValue)
	const filteredUses = useUseFilter(modelReferenceData, purposeValue)
	console.log('Filtered uses result:', filteredUses)

	// Helper functions to get filtered options based on relationships
	const getPurposeName = (id: string) => {
		const purpose = modelReferenceData?.QModelPurpose.find(p => p.purpose_id.toString() === id)
		return purpose ? purpose.purpose : id
	}

	const getUseName = (id: string) => {
		const use = modelReferenceData?.Uses.find(u => u.use_id.toString() === id)
		return use ? use.use : id
	}

	const getAssetClassName = (id: string) => {
		const asset = modelReferenceData?.AssetClass.find(a => a.assetclass_id.toString() === id)
		return asset ? asset.assetclass : id
	}

	const getSubgroupName = (id: string) => {
		const subgroup = modelReferenceData?.Subgroup.find(s => s.subgroup_id.toString() === id)
		return subgroup ? subgroup.subgroup : id
	}

	// Handle form submission
	async function handleSubmit(values: z.infer<typeof formSchema>) {
		try {
			setSubmitting(true)

			// Convert string IDs back to numbers for the API
			const formattedData = {
				uniqueReference: values.uniqueReference,
				modelName: values.modelName,
				modelType: Number.parseInt(values.modelType),
				purpose: Number.parseInt(values.purpose),
				owner: values.owner,
				accountableExec: values.accountableExec,
				modelUses: values.modelUses.map(use => ({
					subgroup: Number.parseInt(use.subgroup),
					use: Number.parseInt(use.use),
					assetClass: Number.parseInt(use.assetClass),
					execUsage: use.execUsage,
					user: use.user
				}))
			}

			console.log('Submitting data:', formattedData)

			// Simulate API call with timeout
			await new Promise(resolve => setTimeout(resolve, 1500))

			// Close the dialog after successful submission
			setShowConfirmDialog(false)

			// Show success message
			alert('Success! Model has been successfully recorded.')

			// Reset form
			form.reset()
		} catch (error: unknown) {
			console.error('Submission error:', error)
			const errorMessage = error instanceof Error ? error.message : 'Something went wrong. Please try again.'
			alert(`Error: ${errorMessage}`)
		} finally {
			setSubmitting(false)
		}
	}

	// Replace the onSubmit function to show the confirmation dialog
	function onSubmit(values: z.infer<typeof formSchema>) {
		console.log('Form values:', values)
		setShowConfirmDialog(true)
	}

	// If data is loading, show loading skeleton
	if (isLoading) {
		return (
			<div className='space-y-4'>
				<div className='space-y-2'>
					<Skeleton className='h-8 w-[250px]' />
					<Skeleton className='h-4 w-[300px]' />
				</div>
				<div className='space-y-2'>
					<Skeleton className='h-10 w-full' />
					<Skeleton className='h-10 w-full' />
					<Skeleton className='h-10 w-full' />
				</div>
				<div className='space-y-2'>
					<Skeleton className='h-8 w-[200px]' />
					<Skeleton className='h-32 w-full' />
				</div>
			</div>
		)
	}

	// If there's an error, show error message
	if (isError) {
		return (
			<div className='p-4 border border-red-300 bg-red-50 rounded-md'>
				<h3 className='text-lg font-medium text-red-800'>Error loading form data</h3>
				<p className='text-red-700'>{error instanceof Error ? error.message : 'An unknown error occurred'}</p>
			</div>
		)
	}

	return (
		<>
			<Tabs defaultValue='entry' className='w-full'>
				<TabsList className='grid w-full grid-cols-2'>
					<TabsTrigger value='entry'>Model Entry</TabsTrigger>
					<TabsTrigger value='preview'>Preview</TabsTrigger>
				</TabsList>
				<TabsContent value='entry'>
					<Card>
						<CardContent className='pt-6'>
							<Form {...form}>
								<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
									<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
										<FormField
											control={form.control}
											name='uniqueReference'
											render={({ field }) => (
												<FormItem>
													<FormLabel>Unique Reference</FormLabel>
													<FormControl>
														<Input {...field} placeholder='Enter unique reference' />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name='modelName'
											render={({ field }) => (
												<FormItem>
													<FormLabel>Model Name</FormLabel>
													<FormControl>
														<Input {...field} placeholder='Enter model name' />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name='modelType'
											render={({ field }) => (
												<FormItem>
													<FormLabel>Model Type</FormLabel>
													<Select onValueChange={field.onChange} defaultValue={field.value}>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder='Select model type' />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{modelReferenceData?.QModelType.map(type => (
																<SelectItem key={type.qm_type_id} value={type.qm_type_id.toString()}>
																	{type.qm_type}
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
											name='purpose'
											render={({ field }) => (
												<FormItem>
													<FormLabel>Purpose</FormLabel>
													<Select onValueChange={field.onChange} defaultValue={field.value}>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder='Select purpose' />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{modelReferenceData?.QModelPurpose.map(purpose => (
																<SelectItem key={purpose.purpose_id} value={purpose.purpose_id.toString()}>
																	{purpose.purpose}
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
											name='owner'
											render={({ field }) => (
												<FormItem>
													<FormLabel>Owner</FormLabel>
													<FormControl>
														<Input {...field} placeholder='Enter owner' />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name='accountableExec'
											render={({ field }) => (
												<FormItem>
													<FormLabel>Accountable Exec (Owner)</FormLabel>
													<FormControl>
														<Input {...field} placeholder='Enter accountable executive' />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

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
																			? filteredAssetClasses.map(
																					(asset: { assetclass_id: number; assetclass: string }) => (
																						<SelectItem
																							key={asset.assetclass_id}
																							value={asset.assetclass_id.toString()}
																						>
																							{asset.assetclass}
																						</SelectItem>
																					)
																			  )
																			: modelReferenceData?.AssetClass?.map(
																					(asset: { assetclass_id: number; assetclass: string }) => (
																						<SelectItem
																							key={asset.assetclass_id}
																							value={asset.assetclass_id.toString()}
																						>
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

									<div className='flex justify-end'>
										<Button type='submit' disabled={submitting}>
											{submitting ? (
												<>
													<Loader2 className='mr-2 h-4 w-4 animate-spin' />
													Submitting...
												</>
											) : (
												'Record Model'
											)}
										</Button>
									</div>
								</form>
							</Form>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value='preview'>
					<Card>
						<CardContent className='pt-6'>
							<div className='space-y-6'>
								<div>
									<h3 className='text-lg font-medium mb-2'>Model Details</h3>
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>QM ID</TableHead>
												<TableHead>QM Name</TableHead>
												<TableHead>Type of QM</TableHead>
												<TableHead>QM Purpose</TableHead>
												<TableHead>Owner</TableHead>
												<TableHead>Accountable Exec (Owner)</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											<TableRow>
												<TableCell>{form.watch('uniqueReference') || '-'}</TableCell>
												<TableCell>{form.watch('modelName') || '-'}</TableCell>
												<TableCell>
													{form.watch('modelType')
														? modelReferenceData?.QModelType.find(
																t => t.qm_type_id.toString() === form.watch('modelType')
														  )?.qm_type || '-'
														: '-'}
												</TableCell>
												<TableCell>{form.watch('purpose') ? getPurposeName(form.watch('purpose')) : '-'}</TableCell>
												<TableCell>{form.watch('owner') || '-'}</TableCell>
												<TableCell>{form.watch('accountableExec') || '-'}</TableCell>
											</TableRow>
										</TableBody>
									</Table>
								</div>

								<div>
									<h3 className='text-lg font-medium mb-2'>Model Uses</h3>
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Sub Group</TableHead>
												<TableHead>Use</TableHead>
												<TableHead>Accountable Exec Usage</TableHead>
												<TableHead>User</TableHead>
												<TableHead>Asset Class</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{form.watch('modelUses').map((use, index) => (
												<TableRow key={index}>
													<TableCell>{use.subgroup ? getSubgroupName(use.subgroup) : '-'}</TableCell>
													<TableCell>{use.use ? getUseName(use.use) : '-'}</TableCell>
													<TableCell>{use.execUsage || '-'}</TableCell>
													<TableCell>{use.user || '-'}</TableCell>
													<TableCell>{use.assetClass ? getAssetClassName(use.assetClass) : '-'}</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>

			{/* Simple confirmation dialog */}
			{showConfirmDialog && (
				<div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
					<div className='bg-white p-6 rounded-lg shadow-lg max-w-md w-full'>
						<h3 className='text-lg font-semibold mb-2 text-primary'>Confirm Submission</h3>
						<p className='mb-4'>Are you sure you want to submit this model information?</p>
						<div className='flex justify-end space-x-2'>
							<button
								className='px-4 py-2 border rounded-md hover:bg-gray-100'
								onClick={() => setShowConfirmDialog(false)}
								type='button'
							>
								Cancel
							</button>
							<button
								className='px-4 py-2 bg-primary	 text-white rounded-md hover:bg-primary/80 flex items-center'
								onClick={() => handleSubmit(form.getValues())}
								disabled={submitting}
								type='button'
							>
								{submitting ? (
									<>
										<svg
											className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
											xmlns='http://www.w3.org/2000/svg'
											fill='none'
											viewBox='0 0 24 24'
										>
											<circle
												className='opacity-25'
												cx='12'
												cy='12'
												r='10'
												stroke='currentColor'
												strokeWidth='4'
											></circle>
											<path
												className='opacity-75'
												fill='currentColor'
												d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
											></path>
										</svg>
										Submitting...
									</>
								) : (
									'Confirm'
								)}
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	)
}
