'use client'

import { useState, useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFieldArray } from 'react-hook-form'
import * as z from 'zod'
import { submitModelData } from '@/lib/actions'
import { PlusCircle, Trash2, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { useSeparateModelReferenceData } from '@/hooks/useModelReferenceData'

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

export default function ModelReferenceFormProgressive() {
	const {
		queries: {
			modelTypesQuery,
			modelPurposesQuery,
			usesQuery,
			assetClassesQuery,
			subgroupsQuery,
			purposeToUseQuery,
			purposeToAssetClassQuery
		},
		data
	} = useSeparateModelReferenceData()

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

	// Update available uses when purpose changes
	useEffect(() => {
		if (selectedPurpose && data) {
			const purposeId = Number.parseInt(selectedPurpose)
			const filteredUses = data.model_reference_data_level2.PurposeToUse.filter(pu => pu.purpose_id === purposeId).map(
				pu => {
					const useObj = data.Uses.find(u => u.use_id === pu.use_id)
					return {
						id: pu.use_id.toString(),
						name: useObj ? useObj.use : `Use ${pu.use_id}`
					}
				}
			)

			setAvailableUses(filteredUses)
		}
	}, [selectedPurpose, data])

	// Update available asset classes when purpose changes
	useEffect(() => {
		if (selectedPurpose && data) {
			const purposeId = Number.parseInt(selectedPurpose)
			const filteredAssetClasses = data.model_reference_data_level2.PurposeToAssetClass.filter(
				pa => pa.purpose_id === purposeId
			).map(pa => {
				const assetClassObj = data.AssetClass.find(ac => ac.assetclass_id === pa.assetclass_id)
				return {
					id: pa.assetclass_id.toString(),
					name: assetClassObj ? assetClassObj.assetclass : `Asset Class ${pa.assetclass_id}`
				}
			})

			setAvailableAssetClasses(filteredAssetClasses)
		}
	}, [selectedPurpose, data])

	async function onSubmit(values: z.infer<typeof formSchema>) {
		setIsSubmitting(true)
		try {
			// Transform the data for submission
			const transformedData = {
				...values,
				modelType: Number.parseInt(values.modelType),
				purpose: Number.parseInt(values.purpose),
				modelUses: values.modelUses.map(use => ({
					...use,
					subgroup: Number.parseInt(use.subgroup),
					use: Number.parseInt(use.use),
					assetClass: Number.parseInt(use.assetClass)
				}))
			}

			await submitModelData(transformedData)
			alert('Model reference data submitted successfully!')
			// Reset the form
			form.reset()
		} catch (error) {
			console.error('Error submitting model reference data:', error)
			alert('Error submitting model reference data. Please try again.')
		} finally {
			setIsSubmitting(false)
		}
	}

	// Helper functions to get names from IDs
	const getPurposeName = (id: string) => {
		const purpose = data?.QModelPurpose.find(p => p.purpose_id === Number.parseInt(id))
		return purpose ? purpose.purpose : id
	}

	const getUseName = (id: string) => {
		const use = data?.Uses.find(u => u.use_id === Number.parseInt(id))
		return use ? use.use : id
	}

	const getAssetClassName = (id: string) => {
		const assetClass = data?.AssetClass.find(ac => ac.assetclass_id === Number.parseInt(id))
		return assetClass ? assetClass.assetclass : id
	}

	const getSubgroupName = (id: string) => {
		const subgroup = data?.Subgroup.find(sg => sg.subgroup_id === Number.parseInt(id))
		return subgroup ? subgroup.subgroup : id
	}

	return (
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
									<Input placeholder='Enter unique reference' {...field} />
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
									<Input placeholder='Enter model name' {...field} />
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
								<FormControl>
									<Select onValueChange={field.onChange} value={field.value}>
										<SelectTrigger>
											{modelTypesQuery.isLoading ? (
												<div className='flex items-center'>
													<Loader2 className='mr-2 h-4 w-4 animate-spin' />
													<span>Loading model types...</span>
												</div>
											) : (
												<SelectValue placeholder='Select model type' />
											)}
										</SelectTrigger>
										<SelectContent>
											{modelTypesQuery.isLoading ? (
												<div className='p-2'>
													<Skeleton className='h-8 w-full' />
													<Skeleton className='h-8 w-full mt-2' />
													<Skeleton className='h-8 w-full mt-2' />
												</div>
											) : modelTypesQuery.isError ? (
												<div className='p-2 text-red-500'>Error loading model types</div>
											) : (
												modelTypesQuery.data?.map(type => (
													<SelectItem key={type.qm_type_id} value={type.qm_type_id.toString()}>
														{type.qm_type}
													</SelectItem>
												))
											)}
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
								<FormLabel>Purpose</FormLabel>
								<FormControl>
									<Select onValueChange={field.onChange} value={field.value}>
										<SelectTrigger>
											{modelPurposesQuery.isLoading ? (
												<div className='flex items-center'>
													<Loader2 className='mr-2 h-4 w-4 animate-spin' />
													<span>Loading purposes...</span>
												</div>
											) : (
												<SelectValue placeholder='Select purpose' />
											)}
										</SelectTrigger>
										<SelectContent>
											{modelPurposesQuery.isLoading ? (
												<div className='p-2'>
													<Skeleton className='h-8 w-full' />
													<Skeleton className='h-8 w-full mt-2' />
													<Skeleton className='h-8 w-full mt-2' />
												</div>
											) : modelPurposesQuery.isError ? (
												<div className='p-2 text-red-500'>Error loading purposes</div>
											) : (
												modelPurposesQuery.data?.map(purpose => (
													<SelectItem key={purpose.purpose_id} value={purpose.purpose_id.toString()}>
														{purpose.purpose}
													</SelectItem>
												))
											)}
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
									<Input placeholder='Enter owner' {...field} />
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
								<FormLabel>Accountable Executive</FormLabel>
								<FormControl>
									<Input placeholder='Enter accountable executive' {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div>
					<h3 className='text-lg font-medium mb-4'>Model Uses</h3>
					{fields.map((field, index) => (
						<Card key={field.id} className='mb-4'>
							<CardContent className='pt-6'>
								<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4'>
									<FormField
										control={form.control}
										name={`modelUses.${index}.subgroup`}
										render={({ field }) => (
											<FormItem>
												<FormLabel>Subgroup</FormLabel>
												<FormControl>
													<Select onValueChange={field.onChange} value={field.value}>
														<SelectTrigger>
															{subgroupsQuery.isLoading ? (
																<div className='flex items-center'>
																	<Loader2 className='mr-2 h-4 w-4 animate-spin' />
																	<span>Loading...</span>
																</div>
															) : (
																<SelectValue placeholder='Select subgroup' />
															)}
														</SelectTrigger>
														<SelectContent>
															{subgroupsQuery.isLoading ? (
																<div className='p-2'>
																	<Skeleton className='h-8 w-full' />
																	<Skeleton className='h-8 w-full mt-2' />
																</div>
															) : subgroupsQuery.isError ? (
																<div className='p-2 text-red-500'>Error loading subgroups</div>
															) : (
																subgroupsQuery.data?.map(subgroup => (
																	<SelectItem key={subgroup.subgroup_id} value={subgroup.subgroup_id.toString()}>
																		{subgroup.subgroup}
																	</SelectItem>
																))
															)}
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
													<Select onValueChange={field.onChange} value={field.value} disabled={!selectedPurpose}>
														<SelectTrigger>
															{usesQuery.isLoading || purposeToUseQuery.isLoading ? (
																<div className='flex items-center'>
																	<Loader2 className='mr-2 h-4 w-4 animate-spin' />
																	<span>Loading...</span>
																</div>
															) : (
																<SelectValue placeholder={selectedPurpose ? 'Select use' : 'Select purpose first'} />
															)}
														</SelectTrigger>
														<SelectContent>
															{usesQuery.isLoading || purposeToUseQuery.isLoading ? (
																<div className='p-2'>
																	<Skeleton className='h-8 w-full' />
																	<Skeleton className='h-8 w-full mt-2' />
																</div>
															) : usesQuery.isError || purposeToUseQuery.isError ? (
																<div className='p-2 text-red-500'>Error loading uses</div>
															) : !selectedPurpose ? (
																<div className='p-2 text-muted-foreground'>Please select a purpose first</div>
															) : availableUses.length === 0 ? (
																<div className='p-2 text-muted-foreground'>No uses available for selected purpose</div>
															) : (
																availableUses.map(use => (
																	<SelectItem key={use.id} value={use.id}>
																		{use.name}
																	</SelectItem>
																))
															)}
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
													<Select onValueChange={field.onChange} value={field.value} disabled={!selectedPurpose}>
														<SelectTrigger>
															{assetClassesQuery.isLoading || purposeToAssetClassQuery.isLoading ? (
																<div className='flex items-center'>
																	<Loader2 className='mr-2 h-4 w-4 animate-spin' />
																	<span>Loading...</span>
																</div>
															) : (
																<SelectValue
																	placeholder={selectedPurpose ? 'Select asset class' : 'Select purpose first'}
																/>
															)}
														</SelectTrigger>
														<SelectContent>
															{assetClassesQuery.isLoading || purposeToAssetClassQuery.isLoading ? (
																<div className='p-2'>
																	<Skeleton className='h-8 w-full' />
																	<Skeleton className='h-8 w-full mt-2' />
																</div>
															) : assetClassesQuery.isError || purposeToAssetClassQuery.isError ? (
																<div className='p-2 text-red-500'>Error loading asset classes</div>
															) : !selectedPurpose ? (
																<div className='p-2 text-muted-foreground'>Please select a purpose first</div>
															) : availableAssetClasses.length === 0 ? (
																<div className='p-2 text-muted-foreground'>
																	No asset classes available for selected purpose
																</div>
															) : (
																availableAssetClasses.map(assetClass => (
																	<SelectItem key={assetClass.id} value={assetClass.id}>
																		{assetClass.name}
																	</SelectItem>
																))
															)}
														</SelectContent>
													</Select>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name={`modelUses.${index}.execUsage`}
										render={({ field }) => (
											<FormItem>
												<FormLabel>Executive Usage</FormLabel>
												<FormControl>
													<Input placeholder='Enter executive usage' {...field} />
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
													<Input placeholder='Enter user' {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								{fields.length > 1 && (
									<Button type='button' variant='outline' size='sm' className='mt-4' onClick={() => remove(index)}>
										<Trash2 className='h-4 w-4 mr-2' />
										Remove
									</Button>
								)}
							</CardContent>
						</Card>
					))}

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
					>
						<PlusCircle className='h-4 w-4 mr-2' />
						Add Another Use
					</Button>
				</div>

				<Tabs defaultValue='table'>
					<TabsList>
						<TabsTrigger value='table'>Table View</TabsTrigger>
						<TabsTrigger value='json'>JSON View</TabsTrigger>
					</TabsList>
					<TabsContent value='table' className='border rounded-md p-4'>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Unique Reference</TableHead>
									<TableHead>Model Name</TableHead>
									<TableHead>Model Type</TableHead>
									<TableHead>Purpose</TableHead>
									<TableHead>Owner</TableHead>
									<TableHead>Accountable Exec</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								<TableRow>
									<TableCell>{form.watch('uniqueReference')}</TableCell>
									<TableCell>{form.watch('modelName')}</TableCell>
									<TableCell>
										{form.watch('modelType')
											? modelTypesQuery.data?.find(t => t.qm_type_id.toString() === form.watch('modelType'))?.qm_type ||
											  form.watch('modelType')
											: '-'}
									</TableCell>
									<TableCell>{form.watch('purpose') ? getPurposeName(form.watch('purpose')) : '-'}</TableCell>
									<TableCell>{form.watch('owner')}</TableCell>
									<TableCell>{form.watch('accountableExec')}</TableCell>
								</TableRow>
							</TableBody>
						</Table>

						<h4 className='text-md font-medium mt-4 mb-2'>Model Uses</h4>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Subgroup</TableHead>
									<TableHead>Use</TableHead>
									<TableHead>Asset Class</TableHead>
									<TableHead>Executive Usage</TableHead>
									<TableHead>User</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{form.watch('modelUses').map((use, index) => (
									<TableRow key={index}>
										<TableCell>{use.subgroup ? getSubgroupName(use.subgroup) : '-'}</TableCell>
										<TableCell>{use.use ? getUseName(use.use) : '-'}</TableCell>
										<TableCell>{use.assetClass ? getAssetClassName(use.assetClass) : '-'}</TableCell>
										<TableCell>{use.execUsage}</TableCell>
										<TableCell>{use.user}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TabsContent>
					<TabsContent value='json' className='border rounded-md p-4'>
						<pre className='whitespace-pre-wrap'>
							{JSON.stringify(
								{
									...form.watch(),
									modelType: form.watch('modelType')
										? modelTypesQuery.data?.find(t => t.qm_type_id.toString() === form.watch('modelType'))?.qm_type ||
										  form.watch('modelType')
										: null,
									purpose: form.watch('purpose') ? getPurposeName(form.watch('purpose')) : null,
									modelUses: form.watch('modelUses').map(use => ({
										...use,
										subgroup: use.subgroup ? getSubgroupName(use.subgroup) : null,
										use: use.use ? getUseName(use.use) : null,
										assetClass: use.assetClass ? getAssetClassName(use.assetClass) : null
									}))
								},
								null,
								2
							)}
						</pre>
					</TabsContent>
				</Tabs>

				<div className='flex justify-end'>
					<Button type='submit' disabled={isSubmitting}>
						{isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
						Submit
					</Button>
				</div>
			</form>
		</Form>
	)
}
