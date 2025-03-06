'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { PlusCircle, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Reference data from reference_data_form.json
const typeOfQMOptions = [
	{ value: '1', label: 'Model' },
	{ value: '2', label: 'DQM in scope' },
	{ value: '3', label: 'DQM out of scope' },
	{ value: '10', label: 'Other' }
]

const modelPurposeOptions = [
	{ value: '1', label: 'Credit' },
	{ value: '2', label: 'Market' },
	{ value: '3', label: 'Operational' },
	{ value: '10', label: 'Other' }
]

// Sub-Group options
const subGroupOptions = [
	{ value: '1', label: 'SG1' },
	{ value: '2', label: 'SG2' },
	{ value: '3', label: 'SG10' },
	{ value: '4', label: 'SG30' }
]

// Model Use options based on purpose_id
const modelUseOptions = {
	'1': [
		// Credit
		{ value: '1', label: 'Capital' },
		{ value: '3', label: 'Pricing' },
		{ value: '4', label: 'Valuation' },
		{ value: '20', label: 'Other' }
	],
	'2': [
		// Market
		{ value: '1', label: 'Capital' },
		{ value: '2', label: 'Liq Management' },
		{ value: '3', label: 'Pricing' },
		{ value: '4', label: 'Valuation' },
		{ value: '5', label: 'Interest Rate Risk Banking book' },
		{ value: '6', label: 'Portfolio Management' },
		{ value: '7', label: 'Stress Testing' },
		{ value: '20', label: 'Other' }
	],
	'3': [
		// Operational
		{ value: '6', label: 'Portfolio Management' },
		{ value: '7', label: 'Stress Testing' },
		{ value: '8', label: 'Risk Assessment' },
		{ value: '20', label: 'Other' }
	],
	'10': [{ value: '20', label: 'Other' }] // Other
}

// Asset Class options based on purpose_id
const assetClassOptions = {
	'1': [
		// Credit
		{ value: '4', label: 'Credit' },
		{ value: '20', label: 'Other' }
	],
	'2': [
		// Market
		{ value: '1', label: 'Rates' },
		{ value: '2', label: 'Equity' },
		{ value: '3', label: 'Commodity' },
		{ value: '5', label: 'FX' },
		{ value: '5', label: 'Hybrid' },
		{ value: '6', label: 'Inflation' },
		{ value: '7', label: 'Credit' },
		{ value: '20', label: 'Other' }
	],
	'3': [
		// Operational
		{ value: '20', label: 'Other' }
	],
	'10': [{ value: '20', label: 'Other' }] // Other
}

// Legal Entity options
const legalEntityOptions = [
	{ value: 'le1', label: 'LE1' },
	{ value: 'le2', label: 'LE2' }
]

// User options
const userOptions = [
	{ value: 'mu1', label: 'MU1' },
	{ value: 'mu2', label: 'MU2' },
	{ value: 'mu33', label: 'MU33' },
	{ value: 'mu8', label: 'MU8' }
]

// Exec options
const execOptions = [
	{ value: 'mrae1', label: 'MRAE1' },
	{ value: 'mrae2', label: 'MRAE2' },
	{ value: 'mrae3', label: 'MRAE3' }
]

// Validation helpers
const isValidUseForPurpose = (purposeId: string, useId: string) => {
	const purposeToUse = {
		'1': ['1'], // Credit -> Capital
		'2': ['1', '2', '3'], // Market -> Capital, Liq Management, Pricing
		'3': ['6', '7', '8'] // Operational -> Portfolio Management, Stress Testing, Risk Assessment
	}
	return purposeToUse[purposeId as keyof typeof purposeToUse]?.includes(useId) || false
}

const isValidAssetClassForPurpose = (purposeId: string, assetClassId: string) => {
	const purposeToAssetClass = {
		'1': ['2', '6'], // Credit -> Equity, Inflation
		'2': ['1', '2', '3'], // Market -> Rates, Equity, Commodity
		'3': ['20'] // Operational -> Other
	}
	return purposeToAssetClass[purposeId as keyof typeof purposeToAssetClass]?.includes(assetClassId) || false
}

const isValidSubgroupForUse = (subgroupId: string, useId: string) => {
	const subgroupToUse = {
		'1': ['1', '7'], // SG1 -> Capital, Stress Testing
		'2': ['3'] // SG2 -> Pricing
	}
	return subgroupToUse[subgroupId as keyof typeof subgroupToUse]?.includes(useId) || false
}

// Form schema with validation
const formSchema = z.object({
	qmId: z.string().min(1, { message: 'QM ID is required' }),
	qmName: z.string().min(1, { message: 'QM Name is required' }),
	typeOfQM: z.string().min(1, { message: 'Type of QM is required' }),
	qmPurpose: z.string().min(1, { message: 'QM Purpose is required' }),
	owner: z.string().min(1, { message: 'Owner is required' }),
	accountableExec: z.string().min(1, { message: 'Accountable Exec is required' }),
	legalEntities: z
		.array(
			z.object({
				entity: z.string(),
				subGroup: z.string(),
				uses: z.array(
					z.object({
						use: z.string(),
						accountableExec: z.string(),
						users: z.array(z.string()),
						assetClasses: z.array(z.string())
					})
				)
			})
		)
		.min(1, { message: 'At least one legal entity is required' })
})

export type FormData = z.infer<typeof formSchema>

type LegalEntityUse = {
	use: string
	accountableExec: string
	users: string[]
	assetClasses: string[]
}

export default function NewModelForm() {
	const [selectedPurpose, setSelectedPurpose] = useState<string>('')
	const [activeTab, setActiveTab] = useState('basic-info')

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			qmId: '',
			qmName: '',
			typeOfQM: '',
			qmPurpose: '',
			owner: '',
			accountableExec: '',
			legalEntities: []
		}
	})

	const legalEntities = form.watch('legalEntities')

	// Add validation function that uses the form context
	const validateFormData = (data: FormData) => {
		const { qmPurpose, legalEntities } = data
		if (!qmPurpose) return true

		return legalEntities.every(entity =>
			entity.uses.every(use => {
				const isValidUse = isValidUseForPurpose(qmPurpose, use.use)
				const isValidAssetClasses = use.assetClasses.every(ac => isValidAssetClassForPurpose(qmPurpose, ac))
				const isValidSubgroup = isValidSubgroupForUse(entity.subGroup, use.use)
				return isValidUse && isValidAssetClasses && isValidSubgroup
			})
		)
	}

	function onSubmit(values: FormData) {
		// Validate the form data
		if (!validateFormData(values)) {
			alert('Invalid combination of purpose, use, asset class, or subgroup')
			return
		}

		// Transform the form data to match the expected format
		const transformedData = {
			qm_id: values.qmId,
			qm_name: values.qmName,
			qm_type_id: parseInt(values.typeOfQM),
			purpose_id: parseInt(values.qmPurpose),
			owner: values.owner,
			accountable_exec: values.accountableExec,
			legal_entities: values.legalEntities.map(entity => ({
				entity_id: entity.entity,
				subgroup_id: parseInt(entity.subGroup),
				uses: entity.uses.map(use => ({
					use_id: parseInt(use.use),
					accountable_exec: use.accountableExec,
					users: use.users.map(user => user),
					asset_classes: use.assetClasses.map(ac => parseInt(ac))
				}))
			}))
		}

		console.log('Transformed data:', transformedData)
		alert('Form submitted successfully! Check console for details.')
	}

	function addLegalEntity() {
		const currentEntities = form.getValues('legalEntities') || []
		form.setValue('legalEntities', [...currentEntities, { entity: '', subGroup: '', uses: [] }])
	}

	function removeLegalEntity(index: number) {
		const currentEntities = [...form.getValues('legalEntities')]
		currentEntities.splice(index, 1)
		form.setValue('legalEntities', currentEntities)
	}

	function addUse(entityIndex: number) {
		const currentEntities = [...form.getValues('legalEntities')]
		const newUse: LegalEntityUse = {
			use: '',
			accountableExec: '',
			users: [],
			assetClasses: []
		}
		currentEntities[entityIndex].uses.push(newUse)
		form.setValue('legalEntities', currentEntities)
	}

	function removeUse(entityIndex: number, useIndex: number) {
		const currentEntities = [...form.getValues('legalEntities')]
		currentEntities[entityIndex].uses.splice(useIndex, 1)
		form.setValue('legalEntities', currentEntities)
	}

	function addUser(entityIndex: number, useIndex: number) {
		const currentEntities = [...form.getValues('legalEntities')]
		currentEntities[entityIndex].uses[useIndex].users.push('')
		form.setValue('legalEntities', currentEntities)
	}

	function removeUser(entityIndex: number, useIndex: number, userIndex: number) {
		const currentEntities = [...form.getValues('legalEntities')]
		currentEntities[entityIndex].uses[useIndex].users.splice(userIndex, 1)
		form.setValue('legalEntities', currentEntities)
	}

	function addAssetClass(entityIndex: number, useIndex: number) {
		const currentEntities = [...form.getValues('legalEntities')]
		currentEntities[entityIndex].uses[useIndex].assetClasses.push('')
		form.setValue('legalEntities', currentEntities)
	}

	function removeAssetClass(entityIndex: number, useIndex: number, assetClassIndex: number) {
		const currentEntities = [...form.getValues('legalEntities')]
		currentEntities[entityIndex].uses[useIndex].assetClasses.splice(assetClassIndex, 1)
		form.setValue('legalEntities', currentEntities)
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
				<Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
					<TabsList className='grid w-full grid-cols-2'>
						<TabsTrigger value='basic-info'>Basic Information</TabsTrigger>
						<TabsTrigger value='legal-entities'>Legal Entities & Uses</TabsTrigger>
					</TabsList>

					<TabsContent value='basic-info' className='space-y-4 mt-4'>
						<Card>
							<CardHeader>
								<CardTitle>Enter model details into the inventory</CardTitle>
								<CardDescription>Fill in the details of the model to add it to the inventory system.</CardDescription>
							</CardHeader>
							<CardContent className='space-y-6'>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
									{/* Basic Model Information */}
									<div className='space-y-4'>
										<FormField
											control={form.control}
											name='qmId'
											render={({ field }) => (
												<FormItem>
													<FormLabel>QM ID</FormLabel>
													<FormControl>
														<Input placeholder='Enter unique reference' {...field} />
													</FormControl>
													<FormDescription>A unique reference for the model</FormDescription>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name='qmName'
											render={({ field }) => (
												<FormItem>
													<FormLabel>QM Name</FormLabel>
													<FormControl>
														<Input placeholder='e.g. Model Y' {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={form.control}
											name='typeOfQM'
											render={({ field }) => (
												<FormItem>
													<FormLabel>Type of QM</FormLabel>
													<Select onValueChange={field.onChange} defaultValue={field.value}>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder='Select type' />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{typeOfQMOptions.map(option => (
																<SelectItem key={option.value} value={option.value}>
																	{option.label}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>

									<div className='space-y-4'>
										<FormField
											control={form.control}
											name='qmPurpose'
											render={({ field }) => (
												<FormItem>
													<FormLabel>QM Purpose</FormLabel>
													<Select
														onValueChange={value => {
															field.onChange(value)
															setSelectedPurpose(value)
														}}
														defaultValue={field.value}
													>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder='Select purpose' />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{modelPurposeOptions.map(option => (
																<SelectItem key={option.value} value={option.value}>
																	{option.label}
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
														<Input placeholder='e.g. MO1' {...field} />
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
													<Select onValueChange={field.onChange} defaultValue={field.value}>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder='Select exec' />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{execOptions.map(option => (
																<SelectItem key={option.value} value={option.value}>
																	{option.label}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</div>

								<div className='flex justify-end'>
									<Button type='button' onClick={() => setActiveTab('legal-entities')}>
										Next: Legal Entities & Uses
									</Button>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value='legal-entities' className='space-y-4 mt-4'>
						<Card>
							<CardHeader>
								<CardTitle>Legal Entities and Model Uses</CardTitle>
								<CardDescription>Define how this model is used across different legal entities.</CardDescription>
							</CardHeader>
							<CardContent className='space-y-6'>
								{/* Legal Entities Section */}
								<div className='space-y-4'>
									<div className='flex justify-between items-center'>
										<h3 className='text-lg font-medium'>Legal Entities</h3>
										<Button type='button' variant='outline' size='sm' onClick={addLegalEntity}>
											<PlusCircle className='h-4 w-4 mr-2' />
											Add Legal Entity
										</Button>
									</div>

									{legalEntities && legalEntities.length > 0 ? (
										<div className='space-y-6'>
											{legalEntities.map((entity, entityIndex) => (
												<Card key={entityIndex} className='relative'>
													<Button
														type='button'
														variant='ghost'
														size='icon'
														className='absolute top-2 right-2'
														onClick={() => removeLegalEntity(entityIndex)}
													>
														<X className='h-4 w-4' />
													</Button>
													<CardHeader>
														<CardTitle className='text-base'>Legal Entity {entityIndex + 1}</CardTitle>
													</CardHeader>
													<CardContent className='space-y-4'>
														<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
															<FormField
																control={form.control}
																name={`legalEntities.${entityIndex}.entity`}
																render={({ field }) => (
																	<FormItem>
																		<FormLabel>Legal Entity</FormLabel>
																		<Select onValueChange={field.onChange} defaultValue={field.value}>
																			<FormControl>
																				<SelectTrigger>
																					<SelectValue placeholder='Select legal entity' />
																				</SelectTrigger>
																			</FormControl>
																			<SelectContent>
																				{legalEntityOptions.map(option => (
																					<SelectItem key={option.value} value={option.value}>
																						{option.label}
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
																name={`legalEntities.${entityIndex}.subGroup`}
																render={({ field }) => (
																	<FormItem>
																		<FormLabel>Sub Group</FormLabel>
																		<Select onValueChange={field.onChange} defaultValue={field.value}>
																			<FormControl>
																				<SelectTrigger>
																					<SelectValue placeholder='Select sub group' />
																				</SelectTrigger>
																			</FormControl>
																			<SelectContent>
																				{subGroupOptions.map(option => (
																					<SelectItem key={option.value} value={option.value}>
																						{option.label}
																					</SelectItem>
																				))}
																			</SelectContent>
																		</Select>
																		<FormMessage />
																	</FormItem>
																)}
															/>
														</div>

														{/* Uses Section */}
														<div className='space-y-2'>
															<div className='flex justify-between items-center'>
																<h4 className='text-sm font-medium'>Uses</h4>
																<Button
																	type='button'
																	variant='outline'
																	size='sm'
																	onClick={() => addUse(entityIndex)}
																	disabled={!selectedPurpose}
																>
																	<PlusCircle className='h-4 w-4 mr-2' />
																	Add Use
																</Button>
															</div>

															{entity.uses && entity.uses.length > 0 ? (
																<div className='space-y-4'>
																	{entity.uses.map((use, useIndex) => (
																		<Card key={useIndex} className='relative'>
																			<Button
																				type='button'
																				variant='ghost'
																				size='icon'
																				className='absolute top-2 right-2'
																				onClick={() => removeUse(entityIndex, useIndex)}
																			>
																				<X className='h-4 w-4' />
																			</Button>
																			<CardContent className='pt-6 space-y-4'>
																				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
																					<FormField
																						control={form.control}
																						name={`legalEntities.${entityIndex}.uses.${useIndex}.use`}
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
																										{selectedPurpose &&
																											modelUseOptions[
																												selectedPurpose as keyof typeof modelUseOptions
																											]?.map(option => (
																												<SelectItem key={option.value} value={option.value}>
																													{option.label}
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
																						name={`legalEntities.${entityIndex}.uses.${useIndex}.accountableExec`}
																						render={({ field }) => (
																							<FormItem>
																								<FormLabel>Accountable Exec Usage</FormLabel>
																								<Select onValueChange={field.onChange} defaultValue={field.value}>
																									<FormControl>
																										<SelectTrigger>
																											<SelectValue placeholder='Select exec' />
																										</SelectTrigger>
																									</FormControl>
																									<SelectContent>
																										{execOptions.map(option => (
																											<SelectItem key={option.value} value={option.value}>
																												{option.label}
																											</SelectItem>
																										))}
																									</SelectContent>
																								</Select>
																								<FormMessage />
																							</FormItem>
																						)}
																					/>
																				</div>

																				{/* Users */}
																				<div className='space-y-2'>
																					<div className='flex justify-between items-center'>
																						<FormLabel>Users</FormLabel>
																						<Button
																							type='button'
																							variant='outline'
																							size='sm'
																							onClick={() => addUser(entityIndex, useIndex)}
																						>
																							<PlusCircle className='h-4 w-4 mr-2' />
																							Add User
																						</Button>
																					</div>

																					<div className='flex flex-wrap gap-2'>
																						{use.users &&
																							use.users.map((user, userIndex) => (
																								<div key={userIndex} className='flex items-center'>
																									<FormField
																										control={form.control}
																										name={`legalEntities.${entityIndex}.uses.${useIndex}.users.${userIndex}`}
																										render={({ field }) => (
																											<FormItem className='flex items-center space-x-2'>
																												<FormControl>
																													<Select
																														onValueChange={field.onChange}
																														defaultValue={field.value}
																													>
																														<SelectTrigger className='w-24'>
																															<SelectValue placeholder='User' />
																														</SelectTrigger>
																														<SelectContent>
																															{userOptions.map(option => (
																																<SelectItem key={option.value} value={option.value}>
																																	{option.label}
																																</SelectItem>
																															))}
																														</SelectContent>
																													</Select>
																												</FormControl>
																												<Button
																													type='button'
																													variant='ghost'
																													size='icon'
																													onClick={() => removeUser(entityIndex, useIndex, userIndex)}
																													className='h-8 w-8'
																												>
																													<X className='h-4 w-4' />
																												</Button>
																											</FormItem>
																										)}
																									/>
																								</div>
																							))}
																					</div>
																				</div>

																				{/* Asset Classes */}
																				<div className='space-y-2'>
																					<div className='flex justify-between items-center'>
																						<FormLabel>Asset Classes</FormLabel>
																						<Button
																							type='button'
																							variant='outline'
																							size='sm'
																							onClick={() => addAssetClass(entityIndex, useIndex)}
																							disabled={!selectedPurpose}
																						>
																							<PlusCircle className='h-4 w-4 mr-2' />
																							Add Asset Class
																						</Button>
																					</div>

																					<div className='flex flex-wrap gap-2'>
																						{use.assetClasses &&
																							use.assetClasses.map((assetClass, assetClassIndex) => (
																								<div key={assetClassIndex} className='flex items-center'>
																									<FormField
																										control={form.control}
																										name={`legalEntities.${entityIndex}.uses.${useIndex}.assetClasses.${assetClassIndex}`}
																										render={({ field }) => (
																											<FormItem>
																												<Select
																													onValueChange={field.onChange}
																													defaultValue={field.value}
																												>
																													<FormControl>
																														<SelectTrigger className='w-32'>
																															<SelectValue placeholder='Select' />
																														</SelectTrigger>
																													</FormControl>
																													<SelectContent>
																														{selectedPurpose &&
																															assetClassOptions[
																																selectedPurpose as keyof typeof assetClassOptions
																															]?.map(option => (
																																<SelectItem key={option.value} value={option.value}>
																																	{option.label}
																																</SelectItem>
																															))}
																													</SelectContent>
																												</Select>
																												<Button
																													type='button'
																													variant='ghost'
																													size='icon'
																													onClick={() =>
																														removeAssetClass(entityIndex, useIndex, assetClassIndex)
																													}
																													className='ml-1 h-8 w-8'
																												>
																													<X className='h-4 w-4' />
																												</Button>
																											</FormItem>
																										)}
																									/>
																								</div>
																							))}
																					</div>
																				</div>
																			</CardContent>
																		</Card>
																	))}
																</div>
															) : (
																<div className='text-center p-4 border border-dashed rounded-md'>
																	<p className='text-sm text-muted-foreground'>
																		{selectedPurpose
																			? "Click 'Add Use' to add model uses for this legal entity"
																			: 'Select a QM Purpose first to add uses'}
																	</p>
																</div>
															)}
														</div>
													</CardContent>
												</Card>
											))}
										</div>
									) : (
										<div className='text-center p-6 border border-dashed rounded-md'>
											<p className='text-muted-foreground'>
												Click &apos;Add Legal Entity&apos; to add legal entities for this model
											</p>
										</div>
									)}
								</div>

								<div className='flex justify-between'>
									<Button type='button' variant='outline' onClick={() => setActiveTab('basic-info')}>
										Back to Basic Info
									</Button>
									<Button type='submit' size='lg'>
										Submit Model Details
									</Button>
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</form>
		</Form>
	)
}
