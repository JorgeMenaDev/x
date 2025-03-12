'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { AlertCircle, Download, FileText, Search, User, Users, Building, Briefcase, AlertTriangle } from 'lucide-react'
import { ValidationStatusBadge } from './common/ValidationStatusBadge'
import { ModelRiskTierBadge } from './common/ModelRiskTierBadge'

// Mock data for the impact analysis
const mockImpactAnalysis = {
	'model-1': {
		id: 'model-1',
		modelName: 'Model Y',
		modelReference: 'MOD-001',
		riskTier: 1, // T1
		owner: 'John Smith',
		validationStatus: 'approved-with-conditions',
		validationDate: '2024-03-10',
		validator: 'Maria Garcia',
		impactedUses: [
			{
				id: 'use-1',
				name: 'Pricing',
				legalEntity: 'LE1',
				subGroup: 'SG1',
				riskTier: 'T1',
				assetClass: 'Equity',
				accountableExec: 'Michael Wong',
				users: ['Trading Desk A', 'Trading Desk B'],
				conditions: 'Not to be used for exotic products without additional controls'
			},
			{
				id: 'use-2',
				name: 'Valuation',
				legalEntity: 'LE2',
				subGroup: 'SG2',
				riskTier: 'T2',
				assetClass: 'Fixed Income',
				accountableExec: 'Jennifer Park',
				users: ['Valuation Team'],
				conditions: 'Additional monitoring required for market stress scenarios'
			}
		]
	},
	'model-2': {
		id: 'model-2',
		modelName: 'Market Risk Model',
		modelReference: 'MOD-002',
		riskTier: 2, // T2
		owner: 'Emily Chen',
		validationStatus: 'approved',
		validationDate: '2024-03-05',
		validator: 'David Wilson',
		impactedUses: [
			{
				id: 'use-3',
				name: 'Risk Assessment',
				legalEntity: 'LE1',
				subGroup: 'SG1',
				riskTier: 'T2',
				assetClass: 'All',
				accountableExec: 'Robert Lee',
				users: ['Risk Management Team'],
				conditions: ''
			}
		]
	},
	'model-3': {
		id: 'model-3',
		modelName: 'Credit Scoring Model',
		modelReference: 'MOD-003',
		riskTier: 1, // T1
		owner: 'Robert Lee',
		validationStatus: 'declined',
		validationDate: '2024-03-01',
		validator: 'Jennifer Park',
		impactedUses: [
			{
				id: 'use-4',
				name: 'Credit Assessment',
				legalEntity: 'LE3',
				subGroup: 'SG3',
				riskTier: 'T1',
				assetClass: 'Credit',
				accountableExec: 'Sarah Johnson',
				users: ['Credit Team A', 'Credit Team B', 'Credit Team C'],
				conditions: 'Model cannot be used until issues are resolved'
			}
		]
	}
}

interface ImpactAnalysisReportProps {
	modelId: string
}

export const ImpactAnalysisReport: React.FC<ImpactAnalysisReportProps> = ({ modelId }) => {
	// Get the impact analysis for the selected model
	const analysis = mockImpactAnalysis[modelId as keyof typeof mockImpactAnalysis]

	// State for search
	const [searchTerm, setSearchTerm] = useState('')

	// Filter impacted uses based on search
	const filteredUses = analysis?.impactedUses.filter(use => {
		if (!searchTerm) return true

		const searchLower = searchTerm.toLowerCase()
		return (
			use.name.toLowerCase().includes(searchLower) ||
			use.legalEntity.toLowerCase().includes(searchLower) ||
			use.subGroup.toLowerCase().includes(searchLower) ||
			use.assetClass.toLowerCase().includes(searchLower) ||
			use.accountableExec.toLowerCase().includes(searchLower) ||
			use.users.some(user => user.toLowerCase().includes(searchLower))
		)
	})

	// Generate notification list for stakeholders
	const generateStakeholderList = () => {
		if (!analysis) return []

		const stakeholders = new Set<string>()

		// Add model owner
		stakeholders.add(analysis.owner)

		// Add accountable execs and users from each use
		analysis.impactedUses.forEach(use => {
			stakeholders.add(use.accountableExec)
			use.users.forEach(user => stakeholders.add(user))
		})

		return Array.from(stakeholders)
	}

	// Handle export report
	const handleExportReport = () => {
		// In a real app, this would generate and download a report
		alert('Exporting impact analysis report...')
	}

	// Handle notify stakeholders
	const handleNotifyStakeholders = () => {
		// In a real app, this would send notifications to stakeholders
		alert(`Notifying ${generateStakeholderList().length} stakeholders...`)
	}

	if (!analysis) {
		return (
			<div className='text-center p-8'>
				<AlertCircle className='mx-auto h-12 w-12 text-muted-foreground mb-4' />
				<h3 className='text-lg font-medium'>Model Not Found</h3>
				<p className='text-muted-foreground'>No impact analysis available for this model</p>
			</div>
		)
	}

	return (
		<div className='space-y-6'>
			{/* Model information */}
			<Card>
				<CardHeader className='pb-4'>
					<div className='flex justify-between items-start'>
						<div>
							<CardTitle>{analysis.modelName}</CardTitle>
							<CardDescription>Reference: {analysis.modelReference}</CardDescription>
						</div>
						<div className='flex items-center gap-2'>
							<ModelRiskTierBadge tier={`T${analysis.riskTier}` as 'T1' | 'T2' | 'T3' | 'T4' | 'T5'} />
							<ValidationStatusBadge status={analysis.validationStatus as any} />
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className='grid grid-cols-2 gap-4 text-sm'>
						<div className='flex items-center gap-2'>
							<User className='h-4 w-4 text-muted-foreground' />
							<span className='text-muted-foreground'>Owner:</span> {analysis.owner}
						</div>
						<div className='flex items-center gap-2'>
							<User className='h-4 w-4 text-muted-foreground' />
							<span className='text-muted-foreground'>Validator:</span> {analysis.validator}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Impact analysis */}
			<Card>
				<CardHeader>
					<div className='flex flex-col md:flex-row justify-between md:items-center gap-4'>
						<div>
							<CardTitle>Impact Analysis</CardTitle>
							<CardDescription>Model uses and stakeholders impacted by validation findings</CardDescription>
						</div>
						<div className='flex gap-2'>
							<Button variant='outline' size='sm' onClick={handleExportReport}>
								<Download className='mr-2 h-4 w-4' />
								Export Report
							</Button>
							<Button size='sm' onClick={handleNotifyStakeholders}>
								<Users className='mr-2 h-4 w-4' />
								Notify Stakeholders
							</Button>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					{/* Search */}
					<div className='mb-6'>
						<div className='relative'>
							<Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
							<Input
								placeholder='Search model uses, entities, or stakeholders...'
								className='pl-8'
								value={searchTerm}
								onChange={e => setSearchTerm(e.target.value)}
							/>
						</div>
					</div>

					{/* Impacted uses table */}
					<div className='rounded-md border'>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Use</TableHead>
									<TableHead>Legal Entity</TableHead>
									<TableHead>Sub Group</TableHead>
									<TableHead>Asset Class</TableHead>
									<TableHead>Risk Tier</TableHead>
									<TableHead>Accountable Exec</TableHead>
									<TableHead>Users</TableHead>
									<TableHead>Conditions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredUses && filteredUses.length > 0 ? (
									filteredUses.map(use => (
										<TableRow key={use.id}>
											<TableCell className='font-medium'>{use.name}</TableCell>
											<TableCell>
												<div className='flex items-center gap-2'>
													<Building className='h-4 w-4 text-muted-foreground' />
													{use.legalEntity}
												</div>
											</TableCell>
											<TableCell>{use.subGroup}</TableCell>
											<TableCell>{use.assetClass}</TableCell>
											<TableCell>
												<ModelRiskTierBadge
													tier={use.riskTier as 'T1' | 'T2' | 'T3' | 'T4' | 'T5'}
													showTooltip={false}
												/>
											</TableCell>
											<TableCell>
												<div className='flex items-center gap-2'>
													<User className='h-4 w-4 text-muted-foreground' />
													{use.accountableExec}
												</div>
											</TableCell>
											<TableCell>
												<div className='flex items-center gap-1'>
													<Users className='h-4 w-4 text-muted-foreground' />
													<span>{use.users.length}</span>
												</div>
											</TableCell>
											<TableCell>
												{use.conditions ? (
													<div className='flex items-start gap-1 max-w-[200px]'>
														<AlertTriangle className='h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0' />
														<span className='text-sm line-clamp-2'>{use.conditions}</span>
													</div>
												) : (
													<span className='text-muted-foreground'>None</span>
												)}
											</TableCell>
										</TableRow>
									))
								) : (
									<TableRow>
										<TableCell colSpan={8} className='h-24 text-center'>
											No impacted uses found
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>

			{/* Stakeholder notification list */}
			<Card>
				<CardHeader>
					<CardTitle>Stakeholder Notification List</CardTitle>
					<CardDescription>Stakeholders who need to be notified of validation findings and conditions</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='space-y-4'>
						{generateStakeholderList().map((stakeholder, index) => (
							<div key={index} className='flex items-center justify-between p-3 border rounded-md'>
								<div className='flex items-center gap-2'>
									<User className='h-4 w-4 text-muted-foreground' />
									<span>{stakeholder}</span>
								</div>
								<div className='flex items-center gap-2'>
									<span className='text-xs text-muted-foreground'>
										{stakeholder === analysis.owner
											? 'Model Owner'
											: analysis.impactedUses.some(use => use.accountableExec === stakeholder)
											? 'Accountable Executive'
											: 'Model User'}
									</span>
								</div>
							</div>
						))}
					</div>
				</CardContent>
				<CardFooter>
					<Button className='w-full' onClick={handleNotifyStakeholders}>
						<Users className='mr-2 h-4 w-4' />
						Notify All Stakeholders
					</Button>
				</CardFooter>
			</Card>
		</div>
	)
}
