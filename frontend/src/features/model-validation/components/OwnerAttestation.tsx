'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { AlertCircle, CheckCircle2, FileText, AlertTriangle, X, User, Calendar } from 'lucide-react'
import { ValidationStatusBadge } from './common/ValidationStatusBadge'
import { ModelRiskTierBadge } from './common/ModelRiskTierBadge'

// Mock data for the selected model and validation
const mockValidations = {
	'model-1': {
		id: 'validation-1',
		modelId: 'model-1',
		modelName: 'Model Y',
		modelReference: 'MOD-001',
		riskTier: 1, // T1
		owner: 'John Smith',
		validationDate: '2024-03-10',
		validator: 'Maria Garcia',
		outcome: 'approved-with-conditions',
		findings: [
			{
				id: 'finding-1',
				severity: 'medium',
				description: 'Model performance degrades under extreme market conditions'
			},
			{
				id: 'finding-2',
				severity: 'low',
				description: 'Documentation needs to be updated to reflect recent changes'
			}
		],
		conditions: [
			{
				id: 'condition-1',
				useId: 'use-1',
				useName: 'Pricing',
				condition: 'Not to be used for exotic products without additional controls'
			},
			{
				id: 'condition-2',
				useId: 'use-2',
				useName: 'Valuation',
				condition: 'Additional monitoring required for market stress scenarios'
			}
		],
		documents: [
			{
				id: 'doc-1',
				name: 'Validation Report.pdf',
				uploadDate: '2024-03-10',
				size: '2.4 MB'
			},
			{
				id: 'doc-2',
				name: 'Model Testing Results.xlsx',
				uploadDate: '2024-03-10',
				size: '1.8 MB'
			}
		]
	},
	'model-2': {
		id: 'validation-2',
		modelId: 'model-2',
		modelName: 'Market Risk Model',
		modelReference: 'MOD-002',
		riskTier: 2, // T2
		owner: 'Emily Chen',
		validationDate: '2024-03-05',
		validator: 'David Wilson',
		outcome: 'approved',
		findings: [
			{
				id: 'finding-3',
				severity: 'low',
				description: 'Minor improvements suggested for efficiency'
			}
		],
		conditions: [],
		documents: [
			{
				id: 'doc-3',
				name: 'Validation Report.pdf',
				uploadDate: '2024-03-05',
				size: '1.9 MB'
			}
		]
	},
	'model-3': {
		id: 'validation-3',
		modelId: 'model-3',
		modelName: 'Credit Scoring Model',
		modelReference: 'MOD-003',
		riskTier: 1, // T1
		owner: 'Robert Lee',
		validationDate: '2024-03-01',
		validator: 'Jennifer Park',
		outcome: 'declined',
		findings: [
			{
				id: 'finding-4',
				severity: 'high',
				description: 'Significant bias detected in model outputs'
			},
			{
				id: 'finding-5',
				severity: 'high',
				description: 'Backtesting shows poor performance on recent data'
			}
		],
		conditions: [],
		documents: [
			{
				id: 'doc-4',
				name: 'Validation Report.pdf',
				uploadDate: '2024-03-01',
				size: '3.1 MB'
			}
		]
	}
}

// Helper function to get severity badge
const getSeverityBadge = (severity: string) => {
	const classes = {
		high: 'bg-red-100 text-red-800 border-red-200',
		medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
		low: 'bg-blue-100 text-blue-800 border-blue-200',
		info: 'bg-gray-100 text-gray-800 border-gray-200'
	}

	const icons = {
		high: <AlertCircle className='h-3 w-3 mr-1' />,
		medium: <AlertTriangle className='h-3 w-3 mr-1' />,
		low: <AlertCircle className='h-3 w-3 mr-1' />,
		info: <FileText className='h-3 w-3 mr-1' />
	}

	const severityClass = classes[severity as keyof typeof classes] || classes.info
	const icon = icons[severity as keyof typeof icons] || icons.info

	return (
		<span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${severityClass}`}>
			{icon}
			{severity.charAt(0).toUpperCase() + severity.slice(1)}
		</span>
	)
}

interface OwnerAttestationProps {
	modelId: string
	onComplete: () => void
}

export const OwnerAttestation: React.FC<OwnerAttestationProps> = ({ modelId, onComplete }) => {
	// Get the validation for the selected model
	const validation = mockValidations[modelId as keyof typeof mockValidations]

	// State for attestation
	const [attestationDecision, setAttestationDecision] = useState<'accept' | 'reject' | ''>('')
	const [attestationComments, setAttestationComments] = useState('')
	const [acknowledgements, setAcknowledgements] = useState<string[]>([])

	// Handle acknowledgement change
	const handleAcknowledgementChange = (id: string, checked: boolean) => {
		if (checked) {
			setAcknowledgements([...acknowledgements, id])
		} else {
			setAcknowledgements(acknowledgements.filter(ack => ack !== id))
		}
	}

	// Check if all required acknowledgements are checked
	const allAcknowledged =
		acknowledgements.includes('findings') &&
		acknowledgements.includes('conditions') &&
		acknowledgements.includes('responsibility')

	// Handle form submission
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		// Validate form
		if (!attestationDecision || !allAcknowledged) {
			alert('Please complete all required fields')
			return
		}

		// In a real app, this would submit the attestation to an API
		console.log('Attestation submitted:', {
			modelId,
			validationId: validation?.id,
			attestationDecision,
			attestationComments,
			acknowledgements
		})

		// Call the onComplete callback to move to the next step
		onComplete()
	}

	if (!validation) {
		return (
			<div className='text-center p-8'>
				<AlertCircle className='mx-auto h-12 w-12 text-muted-foreground mb-4' />
				<h3 className='text-lg font-medium'>Validation Not Found</h3>
				<p className='text-muted-foreground'>No validation record found for this model</p>
			</div>
		)
	}

	return (
		<form onSubmit={handleSubmit}>
			<div className='space-y-6'>
				{/* Model and validation information */}
				<Card>
					<CardHeader className='pb-4'>
						<div className='flex justify-between items-start'>
							<div>
								<CardTitle>{validation.modelName}</CardTitle>
								<CardDescription>Reference: {validation.modelReference}</CardDescription>
							</div>
							<div className='flex items-center gap-2'>
								<ModelRiskTierBadge tier={`T${validation.riskTier}` as 'T1' | 'T2' | 'T3' | 'T4' | 'T5'} />
								<ValidationStatusBadge status={validation.outcome as any} />
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<div className='grid grid-cols-2 gap-4 text-sm'>
							<div className='flex items-center gap-2'>
								<User className='h-4 w-4 text-muted-foreground' />
								<span className='text-muted-foreground'>Owner:</span> {validation.owner}
							</div>
							<div className='flex items-center gap-2'>
								<User className='h-4 w-4 text-muted-foreground' />
								<span className='text-muted-foreground'>Validator:</span> {validation.validator}
							</div>
							<div className='flex items-center gap-2'>
								<Calendar className='h-4 w-4 text-muted-foreground' />
								<span className='text-muted-foreground'>Validation Date:</span> {validation.validationDate}
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Validation findings */}
				<Card>
					<CardHeader>
						<CardTitle>Validation Findings</CardTitle>
						<CardDescription>Review the findings from the validation</CardDescription>
					</CardHeader>
					<CardContent>
						<div className='space-y-4'>
							{validation.findings.length > 0 ? (
								validation.findings.map(finding => (
									<div key={finding.id} className='border rounded-md p-4'>
										<div className='flex items-start gap-3'>
											<div>{getSeverityBadge(finding.severity)}</div>
											<div>
												<p>{finding.description}</p>
											</div>
										</div>
									</div>
								))
							) : (
								<div className='text-center p-4 text-muted-foreground'>
									No findings were recorded for this validation
								</div>
							)}
						</div>
					</CardContent>
				</Card>

				{/* Validation conditions */}
				{validation.conditions.length > 0 && (
					<Card>
						<CardHeader>
							<CardTitle>Model Use Conditions</CardTitle>
							<CardDescription>Review the conditions applied to model uses</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='space-y-4'>
								{validation.conditions.map(condition => (
									<div key={condition.id} className='border rounded-md p-4'>
										<div className='mb-2'>
											<h3 className='font-medium'>{condition.useName}</h3>
										</div>
										<p>{condition.condition}</p>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				)}

				{/* Attestation form */}
				<Card>
					<CardHeader>
						<CardTitle>Owner Attestation</CardTitle>
						<CardDescription>
							As the model owner, you must attest to the validation findings and conditions
						</CardDescription>
					</CardHeader>
					<CardContent className='space-y-6'>
						{/* Acknowledgements */}
						<div className='space-y-4'>
							<h3 className='text-sm font-medium'>Acknowledgements</h3>

							<div className='flex items-start space-x-2'>
								<Checkbox
									id='ack-findings'
									checked={acknowledgements.includes('findings')}
									onCheckedChange={checked => handleAcknowledgementChange('findings', checked as boolean)}
								/>
								<div className='grid gap-1.5 leading-none'>
									<Label
										htmlFor='ack-findings'
										className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
									>
										I acknowledge that I have reviewed all validation findings
									</Label>
								</div>
							</div>

							{validation.conditions.length > 0 && (
								<div className='flex items-start space-x-2'>
									<Checkbox
										id='ack-conditions'
										checked={acknowledgements.includes('conditions')}
										onCheckedChange={checked => handleAcknowledgementChange('conditions', checked as boolean)}
									/>
									<div className='grid gap-1.5 leading-none'>
										<Label
											htmlFor='ack-conditions'
											className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
										>
											I acknowledge the conditions applied to model uses
										</Label>
									</div>
								</div>
							)}

							<div className='flex items-start space-x-2'>
								<Checkbox
									id='ack-responsibility'
									checked={acknowledgements.includes('responsibility')}
									onCheckedChange={checked => handleAcknowledgementChange('responsibility', checked as boolean)}
								/>
								<div className='grid gap-1.5 leading-none'>
									<Label
										htmlFor='ack-responsibility'
										className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
									>
										I understand that as the model owner, I am responsible for ensuring the model is used in accordance
										with these findings and conditions
									</Label>
								</div>
							</div>
						</div>

						{/* Decision */}
						<div className='space-y-4'>
							<h3 className='text-sm font-medium'>Attestation Decision</h3>

							<div className='flex flex-col gap-2'>
								<div className='flex items-center space-x-2'>
									<Button
										type='button'
										variant={attestationDecision === 'accept' ? 'default' : 'outline'}
										className='w-full justify-start'
										onClick={() => setAttestationDecision('accept')}
									>
										<CheckCircle2
											className={`mr-2 h-4 w-4 ${attestationDecision === 'accept' ? 'text-white' : 'text-green-500'}`}
										/>
										Accept Validation Findings and Conditions
									</Button>
								</div>

								<div className='flex items-center space-x-2'>
									<Button
										type='button'
										variant={attestationDecision === 'reject' ? 'destructive' : 'outline'}
										className='w-full justify-start'
										onClick={() => setAttestationDecision('reject')}
									>
										<X className='mr-2 h-4 w-4' />
										Reject Validation Findings and Conditions
									</Button>
								</div>
							</div>
						</div>

						{/* Comments */}
						<div className='space-y-2'>
							<Label htmlFor='attestation-comments'>Comments</Label>
							<Textarea
								id='attestation-comments'
								value={attestationComments}
								onChange={e => setAttestationComments(e.target.value)}
								placeholder='Enter any comments regarding your attestation decision'
								rows={4}
							/>
						</div>
					</CardContent>
					<CardFooter className='flex justify-end gap-2'>
						<Button type='submit' disabled={!attestationDecision || !allAcknowledged}>
							Submit Attestation
						</Button>
					</CardFooter>
				</Card>
			</div>
		</form>
	)
}
