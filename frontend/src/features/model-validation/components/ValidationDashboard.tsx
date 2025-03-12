'use client'

import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ModelValidationStatus } from './ModelValidationStatus'
import { ValidationRecord } from './ValidationRecord'
import { OwnerAttestation } from './OwnerAttestation'
import { ImpactAnalysisReport } from './ImpactAnalysisReport'

// Define the tabs for the validation workflow
const TABS = [
	{ id: 'validation-status', label: 'Validation Status' },
	{ id: 'validation-record', label: 'Record Validation' },
	{ id: 'owner-attestation', label: 'Owner Attestation' },
	{ id: 'impact-analysis', label: 'Impact Analysis' }
]

export const ValidationDashboard: React.FC = () => {
	const [activeTab, setActiveTab] = useState('validation-status')

	// Mock selected model state - in a real app, this would be managed via context or state management
	const [selectedModelId, setSelectedModelId] = useState<string | null>(null)

	// Handler for when a model is selected from the validation status list
	const handleModelSelect = (modelId: string) => {
		setSelectedModelId(modelId)
		// Automatically move to the validation record tab when a model is selected
		setActiveTab('validation-record')
	}

	// Handler for when validation is completed
	const handleValidationComplete = () => {
		// Move to the owner attestation tab
		setActiveTab('owner-attestation')
	}

	// Handler for when attestation is completed
	const handleAttestationComplete = () => {
		// Move to the impact analysis tab
		setActiveTab('impact-analysis')
	}

	return (
		<div className='p-8 space-y-6'>
			<div>
				<h1 className='text-3xl font-bold mb-2'>Model Validation and Attestation</h1>
				<p className='text-muted-foreground'>
					Track and manage the validation process for models, record validation results, and analyze impact.
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Validation Workflow</CardTitle>
					<CardDescription>Follow the steps to complete the model validation and attestation process</CardDescription>
				</CardHeader>
				<CardContent>
					<Tabs value={activeTab} onValueChange={setActiveTab}>
						<TabsList className='grid grid-cols-4'>
							{TABS.map(tab => (
								<TabsTrigger
									key={tab.id}
									value={tab.id}
									disabled={
										// Disable tabs based on workflow state
										(tab.id === 'validation-record' && !selectedModelId) ||
										(tab.id === 'owner-attestation' && !selectedModelId) ||
										(tab.id === 'impact-analysis' && !selectedModelId)
									}
								>
									{tab.label}
								</TabsTrigger>
							))}
						</TabsList>

						<TabsContent value='validation-status' className='mt-6'>
							<ModelValidationStatus onModelSelect={handleModelSelect} />
						</TabsContent>

						<TabsContent value='validation-record' className='mt-6'>
							{selectedModelId ? (
								<ValidationRecord modelId={selectedModelId} onComplete={handleValidationComplete} />
							) : (
								<div className='text-center p-8 text-muted-foreground'>
									Please select a model from the Validation Status tab
								</div>
							)}
						</TabsContent>

						<TabsContent value='owner-attestation' className='mt-6'>
							{selectedModelId ? (
								<OwnerAttestation modelId={selectedModelId} onComplete={handleAttestationComplete} />
							) : (
								<div className='text-center p-8 text-muted-foreground'>Please complete the validation record first</div>
							)}
						</TabsContent>

						<TabsContent value='impact-analysis' className='mt-6'>
							{selectedModelId ? (
								<ImpactAnalysisReport modelId={selectedModelId} />
							) : (
								<div className='text-center p-8 text-muted-foreground'>
									Please complete the attestation process first
								</div>
							)}
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</div>
	)
}
