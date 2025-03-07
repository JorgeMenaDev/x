'use client'

import { useState, useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import * as z from 'zod'
import { submitModelData } from '@/lib/actions'
import { PlusCircle, Trash2 } from 'lucide-react'
import { useSeparateModelReferenceData } from '@/hooks/useModelReferenceData'

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

// Define types for dropdown options
interface DropdownOption {
	id: string
	name: string
}

export default function ModelReferenceForm() {
	// Use the hook to fetch data from the API
	const { data: modelReferenceData, isLoading, isError, error } = useSeparateModelReferenceData()

	const [availableUses, setAvailableUses] = useState<DropdownOption[]>([])
	const [availableAssetClasses, setAvailableAssetClasses] = useState<DropdownOption[]>([])
	const [isSubmitting, setIsSubmitting] = useState(false)

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

	const { watch } = form
	const selectedPurpose = watch('purpose')

	// Only update the form when data is available
	useEffect(() => {
		if (modelReferenceData) {
			// Update available uses when purpose changes
			const purposeId = watch('purpose')
			if (purposeId) {
				updateAvailableUses(purposeId)
			}
		}
	}, [watch('purpose'), modelReferenceData])

	// Update available asset classes when purpose changes
	useEffect(() => {
		if (modelReferenceData) {
			const purposeId = watch('purpose')
			if (purposeId) {
				updateAvailableAssetClasses(purposeId)
			}
		}
	}, [watch('purpose'), modelReferenceData])

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			setIsSubmitting(true)

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

			const result = await submitModelData(formattedData)

			if (result.success) {
				alert('Model recorded successfully: Your model has been added to the inventory.')
			} else {
				throw new Error(result.error || 'Failed to submit form')
			}
		} catch (error: any) {
			alert(`Error: ${error?.message || 'Something went wrong. Please try again.'}`)
		} finally {
			setIsSubmitting(false)
		}
	}

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

	// Update available uses based on selected purpose
	const updateAvailableUses = (purposeId: string) => {
		if (!modelReferenceData) return

		const purposeToUseRelations = modelReferenceData.model_reference_data_level2.PurposeToUse.filter(
			relation => relation.purpose_id.toString() === purposeId
		)

		const useIds = purposeToUseRelations.map(relation => relation.use_id.toString())

		const filteredUses = modelReferenceData.Uses.filter(use => useIds.includes(use.use_id.toString())).map(use => ({
			id: use.use_id.toString(),
			name: use.use
		}))

		setAvailableUses(filteredUses)
	}

	// Update available asset classes based on selected purpose
	const updateAvailableAssetClasses = (purposeId: string) => {
		if (!modelReferenceData) return

		const purposeToAssetClassRelations = modelReferenceData.model_reference_data_level2.PurposeToAssetClass.filter(
			relation => relation.purpose_id.toString() === purposeId
		)

		const assetClassIds = purposeToAssetClassRelations.map(relation => relation.assetclass_id.toString())

		const filteredAssetClasses = modelReferenceData.AssetClass.filter(assetClass =>
			assetClassIds.includes(assetClass.assetclass_id.toString())
		).map(assetClass => ({
			id: assetClass.assetclass_id.toString(),
			name: assetClass.assetclass
		}))

		setAvailableAssetClasses(filteredAssetClasses)
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
													<Controller
														name='uniqueReference'
														control={form.control}
														render={({ field }) => (
															<Input
																type='text'
																placeholder='Enter unique reference'
																value={field.value}
																onChange={field.onChange}
																onBlur={field.onBlur}
																name={field.name}
															/>
														)}
													/>
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
													<Controller
														name='modelName'
														control={form.control}
														render={({ field }) => (
															<Input
																type='text'
																placeholder='Enter model name'
																value={field.value}
																onChange={field.onChange}
																onBlur={field.onBlur}
																name={field.name}
															/>
														)}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
									<FormField
										control={form.control}
										name='modelType'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Type of QM</FormLabel>
												<FormControl>
													<Select onValueChange={field.onChange} value={field.value || ''}>
														<SelectTrigger>
															<SelectValue placeholder='Select model type' />
														</SelectTrigger>
														<SelectContent>
															{modelReferenceData?.QModelType.map(type => (
																<SelectItem key={type.qm_type_id} value={type.qm_type_id.toString()}>
																	{type.qm_type}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name='purpose'
										render={({ field }) => (
											<FormItem>
												<FormLabel>QM Purpose</FormLabel>
												<FormControl>
													<Select onValueChange={field.onChange} value={field.value || ''}>
														<SelectTrigger>
															<SelectValue placeholder='Select purpose' />
														</SelectTrigger>
														<SelectContent>
															{modelReferenceData?.QModelPurpose.map(purpose => (
																<SelectItem key={purpose.purpose_id} value={purpose.purpose_id.toString()}>
																	{purpose.purpose}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</FormControl>
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
													<Controller
														name='owner'
														control={form.control}
														render={({ field }) => (
															<Input
																type='text'
																placeholder='Enter owner'
																value={field.value}
																onChange={field.onChange}
																onBlur={field.onBlur}
																name={field.name}
															/>
														)}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<FormField
									control={form.control}
									name='accountableExec'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Accountable Exec (Owner)</FormLabel>
											<FormControl>
												<Controller
													name='accountableExec'
													control={form.control}
													render={({ field }) => (
														<Input
															type='text'
															placeholder='Enter accountable executive'
															value={field.value}
															onChange={field.onChange}
															onBlur={field.onBlur}
															name={field.name}
														/>
													)}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<div className='space-y-4'>
									<div className='flex items-center justify-between'>
										<h3 className='text-base font-medium'>Model Uses Configuration</h3>
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
											className='flex items-center gap-1 text-[#006a4d]'
										>
											<PlusCircle className='h-4 w-4' />
											<span>Add Use</span>
										</Button>
									</div>

									<p className='text-sm text-gray-500'>
										Add multiple uses for this model by configuring the subgroup, use, asset class, and user
										information.
									</p>

									{fields.map((field, index) => (
										<div key={field.id} className='p-4 border rounded-md bg-gray-50 relative'>
											<div className='absolute right-2 top-2'>
												{fields.length > 1 && (
													<Button
														type='button'
														variant='ghost'
														size='sm'
														onClick={() => remove(index)}
														className='h-8 w-8 p-0 text-red-500'
													>
														<Trash2 className='h-4 w-4' />
														<span className='sr-only'>Remove</span>
													</Button>
												)}
											</div>

											<div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
												<FormField
													control={form.control}
													name={`modelUses.${index}.subgroup`}
													render={({ field }) => (
														<FormItem>
															<FormLabel>Sub Group</FormLabel>
															<FormControl>
																<Select onValueChange={field.onChange} value={field.value || ''}>
																	<SelectTrigger>
																		<SelectValue placeholder='Select subgroup' />
																	</SelectTrigger>
																	<SelectContent>
																		{modelReferenceData?.Subgroup.map(subgroup => (
																			<SelectItem key={subgroup.subgroup_id} value={subgroup.subgroup_id.toString()}>
																				{subgroup.subgroup}
																			</SelectItem>
																		))}
																	</SelectContent>
																</Select>
															</FormControl>
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
															<FormControl>
																<Select onValueChange={field.onChange} value={field.value || ''}>
																	<SelectTrigger>
																		<SelectValue placeholder='Select use' />
																	</SelectTrigger>
																	<SelectContent>
																		{availableUses.map(use => (
																			<SelectItem key={use.id} value={use.id}>
																				{use.name}
																			</SelectItem>
																		))}
																	</SelectContent>
																</Select>
															</FormControl>
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
															<FormControl>
																<Select onValueChange={field.onChange} value={field.value || ''}>
																	<SelectTrigger>
																		<SelectValue placeholder='Select asset class' />
																	</SelectTrigger>
																	<SelectContent>
																		{availableAssetClasses.map(asset => (
																			<SelectItem key={asset.id} value={asset.id}>
																				{asset.name}
																			</SelectItem>
																		))}
																	</SelectContent>
																</Select>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>

											<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
												<FormField
													control={form.control}
													name={`modelUses.${index}.execUsage`}
													render={() => (
														<FormItem>
															<FormLabel>Accountable Exec Usage</FormLabel>
															<FormControl>
																<Controller
																	name={`modelUses.${index}.execUsage`}
																	control={form.control}
																	render={({ field }) => (
																		<Input
																			type='text'
																			placeholder='Enter executive usage code'
																			value={field.value}
																			onChange={field.onChange}
																			onBlur={field.onBlur}
																			name={field.name}
																		/>
																	)}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>

												<FormField
													control={form.control}
													name={`modelUses.${index}.user`}
													render={() => (
														<FormItem>
															<FormLabel>User</FormLabel>
															<FormControl>
																<Controller
																	name={`modelUses.${index}.user`}
																	control={form.control}
																	render={({ field }) => (
																		<Input
																			type='text'
																			placeholder='Enter user'
																			value={field.value}
																			onChange={field.onChange}
																			onBlur={field.onBlur}
																			name={field.name}
																		/>
																	)}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											</div>
										</div>
									))}
								</div>
							</form>
						</Form>
					</CardContent>
				</Card>
			</TabsContent>
			<TabsContent value='preview'>{/* Preview content */}</TabsContent>
		</Tabs>
	)
}
