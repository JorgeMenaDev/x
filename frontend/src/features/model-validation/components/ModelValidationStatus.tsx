'use client'

import React, { useState, useMemo } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ModelRiskTierBadge } from './common/ModelRiskTierBadge'
import { ValidationStatusBadge, ValidationStatus } from './common/ValidationStatusBadge'
import { ValidationDateDisplay } from './common/ValidationDateDisplay'
import { User, Search, Filter } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { fetchModelRiskTiers, ModelRiskTier } from '@/features/tables/risk-tiers-api'
import { isBefore, parseISO, addMonths, differenceInMonths } from 'date-fns'

// Define the model interface based on the provided JSON example
interface ValidationComment {
	comment: string
	commentDate: string
	commentBy: string
}

interface ReviewReport {
	report: string
	reportDate: string
	reportBy: string
	linkToDocument: string
}

interface ModelUse {
	subgroup: number
	use: number
	assetClass: number
	execUsage: string
	user: string
}

interface Model {
	id: string
	uniqueReference: string
	modelName: string
	modelType: number
	purpose: number
	owner: string
	accountableExec: string
	riskTier: number
	lastValidationDate: string
	nextValidationDate: string
	validationStatus: number
	validationComments: ValidationComment[]
	leadReviewer: string
	dateOfReview: string
	typeOfReview: number
	reviewReport: ReviewReport[]
	modelUses: ModelUse[]
}

// Map risk tier numbers to our tier types
const mapRiskTier = (tier: number): 'T1' | 'T2' | 'T3' | 'T4' | 'T5' => {
	const tierMap: Record<number, 'T1' | 'T2' | 'T3' | 'T4' | 'T5'> = {
		1: 'T1',
		2: 'T2',
		3: 'T3',
		4: 'T4',
		5: 'T5'
	}
	return tierMap[tier] || 'T3' // Default to T3 if unknown
}

// Map validation status numbers to our status types
const mapValidationStatus = (status: number): ValidationStatus => {
	const statusMap: Record<number, ValidationStatus> = {
		1: 'due',
		2: 'in-progress',
		3: 'approved',
		4: 'approved-with-conditions',
		5: 'declined',
		6: 'pending'
	}
	return statusMap[status] || 'pending' // Default to pending if unknown
}

// Check if a model is overdue for validation
const isModelOverdue = (nextValidationDate: string): boolean => {
	// For testing purposes, we're using a fixed date (same as in validation-status.ts)
	const CURRENT_DATE = new Date('2025-03-14')
	const nextValidation = parseISO(nextValidationDate)
	return isBefore(nextValidation, CURRENT_DATE)
}

// Check if a model is due for validation based on the alert threshold
const isModelDueForValidation = (nextValidationDate: string, alertThreshold: number): boolean => {
	// For testing purposes, we're using a fixed date (same as in validation-status.ts)
	const CURRENT_DATE = new Date('2025-03-14')
	const nextValidation = parseISO(nextValidationDate)

	// If the model is already overdue, it's definitely due for validation
	if (isBefore(nextValidation, CURRENT_DATE)) {
		return true
	}

	// Calculate months until next validation
	const monthsUntilValidation = differenceInMonths(nextValidation, CURRENT_DATE)

	// If months until validation is less than or equal to alert threshold, it's due for validation
	return monthsUntilValidation <= alertThreshold
}

// Mock data for models
const mockModels: Model[] = [
	{
		id: 'model-1',
		uniqueReference: 'MOD-001',
		modelName: 'Model Y',
		modelType: 2,
		purpose: 2,
		owner: 'John Smith',
		accountableExec: 'Sarah Johnson',
		riskTier: 1, // T1 (1 year frequency)
		lastValidationDate: '2024-04-15',
		nextValidationDate: '2025-04-15', // Correct: 1 year from last validation
		validationStatus: 1,
		validationComments: [],
		leadReviewer: '',
		dateOfReview: '',
		typeOfReview: 0,
		reviewReport: [],
		modelUses: [{ subgroup: 1, use: 1, assetClass: 1, execUsage: 'Pricing', user: 'Trading Desk' }]
	},
	{
		id: 'model-2',
		uniqueReference: 'MOD-002',
		modelName: 'Market Risk Model',
		modelType: 1,
		purpose: 1,
		owner: 'Emily Chen',
		accountableExec: 'Michael Wong',
		riskTier: 2, // T2 (1 year frequency)
		lastValidationDate: '2024-06-10',
		nextValidationDate: '2025-06-10', // Correct: 1 year from last validation
		validationStatus: 2,
		validationComments: [],
		leadReviewer: 'David Wilson',
		dateOfReview: '',
		typeOfReview: 2,
		reviewReport: [],
		modelUses: [{ subgroup: 2, use: 2, assetClass: 2, execUsage: 'Risk Assessment', user: 'Risk Management' }]
	},
	{
		id: 'model-3',
		uniqueReference: 'MOD-003',
		modelName: 'Credit Scoring Model',
		modelType: 3,
		purpose: 3,
		owner: 'Robert Lee',
		accountableExec: 'Jennifer Park',
		riskTier: 1, // T1 (1 year frequency)
		lastValidationDate: '2024-01-20',
		nextValidationDate: '2025-01-20', // Correct: 1 year from last validation
		validationStatus: 1,
		validationComments: [],
		leadReviewer: '',
		dateOfReview: '',
		typeOfReview: 0,
		reviewReport: [],
		modelUses: [{ subgroup: 3, use: 3, assetClass: 3, execUsage: 'Credit Assessment', user: 'Credit Department' }]
	},
	{
		id: 'model-4',
		uniqueReference: 'MOD-004',
		modelName: 'Portfolio Optimization Model',
		modelType: 2,
		purpose: 2,
		owner: 'Alice Johnson',
		accountableExec: 'Tom Wilson',
		riskTier: 3, // T3 (2 year frequency)
		lastValidationDate: '2023-03-15',
		nextValidationDate: '2025-03-15', // Correct: 2 years from last validation
		validationStatus: 1,
		validationComments: [],
		leadReviewer: '',
		dateOfReview: '',
		typeOfReview: 0,
		reviewReport: [],
		modelUses: [{ subgroup: 1, use: 2, assetClass: 2, execUsage: 'Portfolio Management', user: 'Investment Team' }]
	},
	{
		id: 'model-5',
		uniqueReference: 'MOD-005',
		modelName: 'Regulatory Capital Model',
		modelType: 1,
		purpose: 1,
		owner: 'David Chang',
		accountableExec: 'Maria Garcia',
		riskTier: 5, // T5 (3 year frequency)
		lastValidationDate: '2022-03-20',
		nextValidationDate: '2025-03-20', // Correct: 3 years from last validation
		validationStatus: 1,
		validationComments: [],
		leadReviewer: '',
		dateOfReview: '',
		typeOfReview: 0,
		reviewReport: [],
		modelUses: [{ subgroup: 4, use: 1, assetClass: 1, execUsage: 'Regulatory Reporting', user: 'Risk Team' }]
	},
	{
		id: 'model-6',
		uniqueReference: 'MOD-006',
		modelName: 'Trading Analytics Model',
		modelType: 1,
		purpose: 1,
		owner: 'Sophie Wilson',
		accountableExec: 'James Brown',
		riskTier: 4, // T4 (3 year frequency)
		lastValidationDate: '2022-05-15',
		nextValidationDate: '2025-05-15', // Correct: 3 years from last validation
		validationStatus: 1,
		validationComments: [],
		leadReviewer: '',
		dateOfReview: '',
		typeOfReview: 0,
		reviewReport: [],
		modelUses: [{ subgroup: 2, use: 1, assetClass: 1, execUsage: 'Trading Analytics', user: 'Trading Team' }]
	}
]

interface ModelValidationStatusProps {
	onModelSelect: (modelId: string) => void
}

export const ModelValidationStatus: React.FC<ModelValidationStatusProps> = ({ onModelSelect }) => {
	const [searchTerm, setSearchTerm] = useState('')
	const [statusFilter, setStatusFilter] = useState<string>('all')
	const [riskTierFilter, setRiskTierFilter] = useState<string>('all')

	// Fetch risk tier configurations
	const { data: riskTiers, isLoading: isLoadingRiskTiers } = useQuery({
		queryKey: ['riskTiers'],
		queryFn: fetchModelRiskTiers
	})

	// Create a map of risk tier configurations for easy lookup
	const riskTierConfigMap = useMemo(() => {
		if (!riskTiers) return new Map<string, ModelRiskTier>()
		return new Map(riskTiers.map(tier => [tier.tier, tier]))
	}, [riskTiers])

	// Filter models based on search and filters
	const filteredModels = mockModels.filter(model => {
		// Search filter
		const matchesSearch =
			model.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			model.uniqueReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
			model.owner.toLowerCase().includes(searchTerm.toLowerCase())

		// Get risk tier and config
		const riskTier = mapRiskTier(model.riskTier)
		const riskTierConfig = riskTierConfigMap.get(riskTier)
		const alertThreshold = riskTierConfig?.alert_threshold || 3

		// Check if model is overdue
		const isOverdue = isModelOverdue(model.nextValidationDate)

		// Check if model is due for validation based on alert threshold
		const isDue = isModelDueForValidation(model.nextValidationDate, alertThreshold)

		// Determine the model status
		let effectiveStatus: ValidationStatus
		if (isOverdue) {
			effectiveStatus = 'overdue'
		} else if (isDue) {
			effectiveStatus = 'due'
		} else if (mapValidationStatus(model.validationStatus) === 'due') {
			effectiveStatus = 'scheduled'
		} else {
			effectiveStatus = mapValidationStatus(model.validationStatus)
		}

		// Status filter
		const matchesStatus = statusFilter === 'all' || effectiveStatus === statusFilter

		// Risk tier filter
		const matchesRiskTier = riskTierFilter === 'all' || riskTier === riskTierFilter

		return matchesSearch && matchesStatus && matchesRiskTier
	})

	if (isLoadingRiskTiers) {
		return <div>Loading...</div>
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Models Due for Validation</CardTitle>
				<CardDescription>
					View and manage models that require validation based on risk tier and previous validation dates
				</CardDescription>
			</CardHeader>
			<CardContent>
				{/* Search and filters */}
				<div className='flex flex-col md:flex-row gap-4 mb-6'>
					<div className='relative flex-1'>
						<Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
						<Input
							placeholder='Search models...'
							className='pl-8'
							value={searchTerm}
							onChange={e => setSearchTerm(e.target.value)}
						/>
					</div>

					<div className='flex gap-2'>
						<Select value={statusFilter} onValueChange={setStatusFilter}>
							<SelectTrigger className='w-[180px]'>
								<SelectValue placeholder='Filter by status' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='all'>All Statuses</SelectItem>
								<SelectItem value='overdue'>Overdue</SelectItem>
								<SelectItem value='due'>Validation Due</SelectItem>
								<SelectItem value='scheduled'>Scheduled</SelectItem>
								<SelectItem value='in-progress'>In Progress</SelectItem>
								<SelectItem value='approved'>Approved</SelectItem>
								<SelectItem value='approved-with-conditions'>Approved with Conditions</SelectItem>
								<SelectItem value='declined'>Declined</SelectItem>
							</SelectContent>
						</Select>

						<Select value={riskTierFilter} onValueChange={setRiskTierFilter}>
							<SelectTrigger className='w-[180px]'>
								<SelectValue placeholder='Filter by risk tier' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='all'>All Risk Tiers</SelectItem>
								<SelectItem value='T1'>T1</SelectItem>
								<SelectItem value='T2'>T2</SelectItem>
								<SelectItem value='T3'>T3</SelectItem>
								<SelectItem value='T4'>T4</SelectItem>
								<SelectItem value='T5'>T5</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				{/* Models table */}
				<div className='rounded-md border'>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Model Reference</TableHead>
								<TableHead>Model Name</TableHead>
								<TableHead>Risk Tier</TableHead>
								<TableHead>Owner</TableHead>
								<TableHead>Last Validation</TableHead>
								<TableHead>Next Validation</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className='text-right'>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filteredModels.length > 0 ? (
								filteredModels.map(model => {
									const riskTier = mapRiskTier(model.riskTier)
									const riskTierConfig = riskTierConfigMap.get(riskTier)

									// Default alert threshold if config is not available
									const alertThreshold = riskTierConfig?.alert_threshold || 3

									// Determine if the model is overdue
									const isOverdue = isModelOverdue(model.nextValidationDate)

									// Determine if the model is due for validation based on alert threshold
									const isDue = isModelDueForValidation(model.nextValidationDate, alertThreshold)

									// Determine the model status
									let modelStatus: ValidationStatus
									if (isOverdue) {
										modelStatus = 'overdue'
									} else if (isDue) {
										modelStatus = 'due'
									} else if (mapValidationStatus(model.validationStatus) === 'due') {
										// If the model's status is 'due' but it's not actually due yet based on the alert threshold,
										// change it to 'scheduled'
										modelStatus = 'scheduled'
									} else {
										modelStatus = mapValidationStatus(model.validationStatus)
									}

									return (
										<TableRow key={model.id}>
											<TableCell className='font-medium'>{model.uniqueReference}</TableCell>
											<TableCell>{model.modelName}</TableCell>
											<TableCell>
												<ModelRiskTierBadge tier={riskTier} />
											</TableCell>
											<TableCell>
												<div className='flex items-center gap-2'>
													<User className='h-4 w-4 text-muted-foreground' />
													{model.owner}
												</div>
											</TableCell>
											<TableCell>
												<ValidationDateDisplay date={model.lastValidationDate} type='last' />
											</TableCell>
											<TableCell>
												<ValidationDateDisplay
													date={model.nextValidationDate}
													type='due'
													riskTierConfig={riskTierConfig}
													lastValidationDate={model.lastValidationDate}
												/>
											</TableCell>
											<TableCell>
												<ValidationStatusBadge status={modelStatus} />
											</TableCell>
											<TableCell className='text-right'>
												<Button
													onClick={() => onModelSelect(model.id)}
													variant={
														modelStatus === 'due'
															? 'outline'
															: modelStatus === 'overdue'
															? 'outline'
															: modelStatus === 'scheduled'
															? 'outline'
															: 'outline'
													}
													size='sm'
												>
													{modelStatus === 'due' || modelStatus === 'overdue' ? 'Start Validation' : 'View Details'}
												</Button>
											</TableCell>
										</TableRow>
									)
								})
							) : (
								<TableRow>
									<TableCell colSpan={8} className='h-24 text-center'>
										No models found matching the current filters
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	)
}
