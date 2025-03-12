'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle, CheckCircle2, FileText, Upload, X, AlertTriangle } from 'lucide-react'
import { ValidationStatusBadge } from './common/ValidationStatusBadge'
import { ModelRiskTierBadge } from './common/ModelRiskTierBadge'
import { ValidationConditions } from './ValidationConditions'

// Mock data for the selected model
const mockModels = {
	'model-1': {
		id: 'model-1',
		uniqueReference: 'MOD-001',
		modelName: 'Model Y',
		owner: 'John Smith',
		riskTier: 1, // T1
		lastValidationDate: '2023-04-15',
		nextValidationDate: '2024-04-15',
		validationStatus: 1, // Due
		modelUses: [
			{
				id: 'use-1',
				name: 'Pricing',
				legalEntity: 'LE1',
				assetClass: 'Equity',
				subGroup: 'SG1'
			},
			{
				id: 'use-2',
				name: 'Valuation',
				legalEntity: 'LE2',
				assetClass: 'Fixed Income',
				subGroup: 'SG2'
			}
		]
	},
	'model-2': {
		id: 'model-2',
		uniqueReference: 'MOD-002',
		modelName: 'Market Risk Model',
		owner: 'Emily Chen',
		riskTier: 2, // T2
		lastValidationDate: '2023-06-10',
		nextValidationDate: '2024-06-10',
		validationStatus: 2, // In Progress
		modelUses: [
			{
				id: 'use-3',
				name: 'Risk Assessment',
				legalEntity: 'LE1',
				assetClass: 'All',
				subGroup: 'SG1'
			}
		]
	},
	'model-3': {
		id: 'model-3',
		uniqueReference: 'MOD-003',
		modelName: 'Credit Scoring Model',
		owner: 'Robert Lee',
		riskTier: 1, // T1
		lastValidationDate: '2023-01-20',
		nextValidationDate: '2024-01-20',
		validationStatus: 1, // Due
		modelUses: [
			{
				id: 'use-4',
				name: 'Credit Assessment',
				legalEntity: 'LE3',
				assetClass: 'Credit',
				subGroup: 'SG3'
			}
		]
	}
}

// Define validation outcome types
type ValidationOutcome = 'approved' | 'approved-with-conditions' | 'declined' | ''

// Define document type
interface ValidationDocument {
	id: string
	name: string
	uploadDate: string
	size: string
}

interface ValidationRecordProps {
	modelId: string
	onComplete: () => void
}

export const ValidationRecord: React.FC<ValidationRecordProps> = ({ modelId, onComplete }) => {
	// Get the selected model
	const model = mockModels[modelId as keyof typeof mockModels]

	// State for validation form
	const [validationOutcome, setValidationOutcome] = useState<ValidationOutcome>('')
	const [validatorName, setValidatorName] = useState('')
	const [validationDate, setValidationDate] = useState('')
	const [validationComments, setValidationComments] = useState('')
	const [documents, setDocuments] = useState<ValidationDocument[]>([])
	const [activeTab, setActiveTab] = useState('details')

	// State for model use conditions
	const [useConditions, setUseConditions] = useState<Record<string, string>>({})

	// Handle document upload
	const handleDocumentUpload = () => {
		// In a real app, this would handle file uploads
		// For now, we'll just add a mock document
		const newDoc: ValidationDocument = {
			id: `doc-${documents.length + 1}`,
			name: `Validation Report ${documents.length + 1}.pdf`,
			uploadDate: new Date().toISOString().split('T')[0],
			size: '2.4 MB'
		}

		setDocuments([...documents, newDoc])
	}

	// Handle document removal
	const handleRemoveDocument = (docId: string) => {
		setDocuments(documents.filter(doc => doc.id !== docId))
	}

	// Handle use condition change
	const handleUseConditionChange = (useId: string, condition: string) => {
		setUseConditions({
			...useConditions,
			[useId]: condition
		})
	}

	// Handle form submission
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		// Validate form
		if (!validationOutcome || !validatorName || !validationDate) {
			alert('Please fill in all required fields')
			return
		}

		// In a real app, this would submit the validation record to an API
		console.log('Validation record submitted:', {
			modelId,
			validationOutcome,
			validatorName,
			validationDate,
			validationComments,
			documents,
			useConditions
		})

		// Call the onComplete callback to move to the next step
		onComplete()
	}

	if (!model) {
		return (
			<div className='text-center p-8'>
				<AlertCircle className='mx-auto h-12 w-12 text-muted-foreground mb-4' />
				<h3 className='text-lg font-medium'>Model Not Found</h3>
				<p className='text-muted-foreground'>The selected model could not be found</p>
			</div>
		)
	}

	return (
		<form onSubmit={handleSubmit}>
			<div className='space-y-6'>
				{/* Model information card */}
				<Card>
					<CardHeader className='pb-4'>
						<div className='flex justify-between items-start'>
							<div>
								<CardTitle>{model.modelName}</CardTitle>
								<CardDescription>Reference: {model.uniqueReference}</CardDescription>
							</div>
							<div className='flex items-center gap-2'>
								<ModelRiskTierBadge tier={`T${model.riskTier}` as 'T1' | 'T2' | 'T3' | 'T4' | 'T5'} />
								<ValidationStatusBadge
									status={
										model.validationStatus === 1 ? 'due' : model.validationStatus === 2 ? 'in-progress' : 'pending'
									}
								/>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<div className='grid grid-cols-2 gap-4 text-sm'>
							<div>
								<span className='text-muted-foreground'>Owner:</span> {model.owner}
							</div>
							<div>
								<span className='text-muted-foreground'>Last Validation:</span> {model.lastValidationDate}
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Validation tabs */}
				<Tabs value={activeTab} onValueChange={setActiveTab}>
					<TabsList className='grid grid-cols-3'>
						<TabsTrigger value='details'>Validation Details</TabsTrigger>
						<TabsTrigger value='documents'>Documents</TabsTrigger>
						<TabsTrigger value='conditions' disabled={validationOutcome !== 'approved-with-conditions'}>
							Use Conditions
						</TabsTrigger>
					</TabsList>

					{/* Validation details tab */}
					<TabsContent value='details'>
						<Card>
							<CardHeader>
								<CardTitle>Validation Details</CardTitle>
								<CardDescription>Record the outcome of the model validation</CardDescription>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<div className='space-y-2'>
										<Label htmlFor='validator-name'>Validator Name</Label>
										<Input
											id='validator-name'
											value={validatorName}
											onChange={e => setValidatorName(e.target.value)}
											placeholder='Enter validator name'
											required
										/>
									</div>

									<div className='space-y-2'>
										<Label htmlFor='validation-date'>Validation Date</Label>
										<Input
											id='validation-date'
											type='date'
											value={validationDate}
											onChange={e => setValidationDate(e.target.value)}
											required
										/>
									</div>
								</div>

								<div className='space-y-2'>
									<Label htmlFor='validation-outcome'>Validation Outcome</Label>
									<Select
										value={validationOutcome}
										onValueChange={value => setValidationOutcome(value as ValidationOutcome)}
									>
										<SelectTrigger>
											<SelectValue placeholder='Select validation outcome' />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value='approved'>
												<div className='flex items-center gap-2'>
													<CheckCircle2 className='h-4 w-4 text-green-500' />
													<span>Approved</span>
												</div>
											</SelectItem>
											<SelectItem value='approved-with-conditions'>
												<div className='flex items-center gap-2'>
													<AlertTriangle className='h-4 w-4 text-yellow-500' />
													<span>Approved with Conditions</span>
												</div>
											</SelectItem>
											<SelectItem value='declined'>
												<div className='flex items-center gap-2'>
													<X className='h-4 w-4 text-red-500' />
													<span>Declined</span>
												</div>
											</SelectItem>
										</SelectContent>
									</Select>

									{validationOutcome === 'approved-with-conditions' && (
										<p className='text-sm text-muted-foreground mt-1'>
											You will need to specify conditions for each model use in the "Use Conditions" tab.
										</p>
									)}
								</div>

								<div className='space-y-2'>
									<Label htmlFor='validation-comments'>Comments</Label>
									<Textarea
										id='validation-comments'
										value={validationComments}
										onChange={e => setValidationComments(e.target.value)}
										placeholder='Enter any comments or findings from the validation'
										rows={4}
									/>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Documents tab */}
					<TabsContent value='documents'>
						<Card>
							<CardHeader>
								<CardTitle>Validation Documents</CardTitle>
								<CardDescription>Upload documents related to the validation</CardDescription>
							</CardHeader>
							<CardContent>
								<div className='space-y-4'>
									<div className='border border-dashed rounded-lg p-8 text-center'>
										<FileText className='mx-auto h-8 w-8 text-muted-foreground mb-2' />
										<h3 className='text-lg font-medium mb-1'>Upload Validation Documents</h3>
										<p className='text-sm text-muted-foreground mb-4'>
											Drag and drop files here or click the button below
										</p>
										<Button type='button' variant='outline' onClick={handleDocumentUpload}>
											<Upload className='mr-2 h-4 w-4' />
											Select Files
										</Button>
									</div>

									{documents.length > 0 && (
										<div className='space-y-2'>
											<h4 className='text-sm font-medium'>Uploaded Documents</h4>
											<div className='border rounded-md divide-y'>
												{documents.map(doc => (
													<div key={doc.id} className='flex items-center justify-between p-3'>
														<div className='flex items-center gap-2'>
															<FileText className='h-4 w-4 text-muted-foreground' />
															<span>{doc.name}</span>
															<span className='text-xs text-muted-foreground'>
																{doc.size} • {doc.uploadDate}
															</span>
														</div>
														<Button
															type='button'
															variant='ghost'
															size='sm'
															onClick={() => handleRemoveDocument(doc.id)}
														>
															<X className='h-4 w-4' />
														</Button>
													</div>
												))}
											</div>
										</div>
									)}
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					{/* Use conditions tab */}
					<TabsContent value='conditions'>
						<ValidationConditions
							modelUses={model.modelUses}
							conditions={useConditions}
							onConditionChange={handleUseConditionChange}
						/>
					</TabsContent>
				</Tabs>

				{/* Action buttons */}
				<div className='flex justify-end gap-2'>
					<Button
						type='button'
						variant='outline'
						onClick={() => {
							// In a real app, this would save as draft
							alert('Validation record saved as draft')
						}}
					>
						Save as Draft
					</Button>
					<Button
						type='submit'
						disabled={
							!validationOutcome ||
							!validatorName ||
							!validationDate ||
							(validationOutcome === 'approved-with-conditions' && model.modelUses.some(use => !useConditions[use.id]))
						}
					>
						Complete Validation
					</Button>
				</div>
			</div>
		</form>
	)
}
