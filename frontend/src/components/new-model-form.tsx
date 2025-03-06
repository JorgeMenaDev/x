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

// Reference data based on the screenshot
const typeOfQMOptions = [
	{ value: 'model', label: 'Model' },
	{ value: 'dqm_in_scope', label: 'DQM In scope' },
	{ value: 'dqm_out_scope', label: 'DQM out scope' },
	{ value: 'other', label: 'Other' }
]

const modelPurposeOptions = [
	{ value: 'market', label: 'Market' },
	{ value: 'credit', label: 'Credit' },
	{ value: 'operational', label: 'Operational' },
	{ value: 'other', label: 'Other' }
]

// Sub-Group options
const subGroupOptions = [
	{ value: 'sg1', label: 'SG1' },
	{ value: 'sg2', label: 'SG2' },
	{ value: 'sg3', label: 'SG3' }
]

// Model Use options are dependent on Purpose
const modelUseOptions = {
	market: [
		{ value: 'capital', label: 'Capital' },
		{ value: 'liquidity_management', label: 'Liquidity Management' },
		{ value: 'pricing', label: 'Pricing' },
		{ value: 'valuation', label: 'Valuation' },
		{ value: 'interest_rate_risk', label: 'Interest Rate Risk Banking Book' },
		{ value: 'portfolio_management', label: 'Portfolio Management' },
		{ value: 'stress_testing', label: 'Stress Testing' },
		{ value: 'other', label: 'Other' }
	],
	credit: [
		{ value: 'capital', label: 'Capital' },
		{ value: 'pricing', label: 'Pricing' },
		{ value: 'valuation', label: 'Valuation' },
		{ value: 'other', label: 'Other' }
	],
	operational: [
		{ value: 'risk_assessment', label: 'Risk Assessment' },
		{ value: 'other', label: 'Other' }
	],
	other: [{ value: 'other', label: 'Other' }]
}

// Asset Class options are dependent on Purpose
const assetClassOptions = {
	market: [
		{ value: 'rates', label: 'Rates' },
		{ value: 'equity', label: 'Equity' },
		{ value: 'commodity', label: 'Commodity' },
		{ value: 'fx', label: 'FX' },
		{ value: 'hybrid', label: 'Hybrid' },
		{ value: 'inflation', label: 'Inflation' },
		{ value: 'credit', label: 'Credit' },
		{ value: 'other', label: 'Other' }
	],
	credit: [
		{ value: 'credit', label: 'Credit' },
		{ value: 'other', label: 'Other' }
	],
	operational: [
		{ value: 'operational', label: 'Operational' },
		{ value: 'other', label: 'Other' }
	],
	other: [{ value: 'other', label: 'Other' }]
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

// Form schema
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

// Type used for documentation and type safety in helper functions
type LegalEntityUse = {
	use: string
	accountableExec: string
	users: string[]
	assetClasses: string[]
}

export default function NewModelForm() {
	const [selectedPurpose, setSelectedPurpose] = useState<string>('')
	const [activeTab, setActiveTab] = useState('basic-info')

	const form = useForm<z.infer<typeof formSchema>>({
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

	function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values)
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
