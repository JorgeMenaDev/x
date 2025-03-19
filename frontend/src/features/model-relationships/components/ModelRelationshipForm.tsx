'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { useModels } from '../api/get-models'
import { useCreateRelationship, CreateRelationshipInput } from '../api/create-relationship'
import { Model } from '../types'

interface ModelRelationshipFormProps {
	onRelationshipCreated?: () => void
}

export default function ModelRelationshipForm({ onRelationshipCreated }: ModelRelationshipFormProps) {
	const { data, isLoading } = useModels()
	const models = (data ?? []) as Model[]
	const createRelationship = useCreateRelationship()

	const [sourceModelId, setSourceModelId] = useState<string>('')
	const [targetModelId, setTargetModelId] = useState<string>('')
	const [relationshipType, setRelationshipType] = useState<'input' | 'output'>('output')
	const [description, setDescription] = useState<string>('')

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		if (!sourceModelId || !targetModelId || !relationshipType) {
			return
		}

		const input: CreateRelationshipInput = {
			sourceModelId,
			targetModelId,
			type: relationshipType,
			description: description || undefined
		}

		createRelationship.mutate(input, {
			onSuccess: () => {
				// Reset form
				setSourceModelId('')
				setTargetModelId('')
				setRelationshipType('output')
				setDescription('')

				// Notify parent component
				if (onRelationshipCreated) {
					onRelationshipCreated()
				}
			}
		})
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Add Model Relationship</CardTitle>
				<CardDescription>Define relationships between models in the inventory</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className='space-y-4'>
					<div className='space-y-2'>
						<Label htmlFor='sourceModel'>Source Model</Label>
						<Select value={sourceModelId} onValueChange={setSourceModelId} disabled={isLoading}>
							<SelectTrigger id='sourceModel'>
								<SelectValue placeholder='Select a source model' />
							</SelectTrigger>
							<SelectContent>
								{models.map(model => (
									<SelectItem key={model.uniqueReference} value={model.uniqueReference}>
										{model.modelName}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='relationshipType'>Relationship Type</Label>
						<Select value={relationshipType} onValueChange={value => setRelationshipType(value as 'input' | 'output')}>
							<SelectTrigger id='relationshipType'>
								<SelectValue placeholder='Select relationship type' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='output'>Output to</SelectItem>
								<SelectItem value='input'>Input from</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='targetModel'>Target Model</Label>
						<Select value={targetModelId} onValueChange={setTargetModelId} disabled={isLoading}>
							<SelectTrigger id='targetModel'>
								<SelectValue placeholder='Select a target model' />
							</SelectTrigger>
							<SelectContent>
								{models
									.filter(model => model.uniqueReference !== sourceModelId)
									.map(model => (
										<SelectItem key={model.uniqueReference} value={model.uniqueReference}>
											{model.modelName}
										</SelectItem>
									))}
							</SelectContent>
						</Select>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='description'>Description (Optional)</Label>
						<Input
							id='description'
							placeholder='Describe this relationship'
							value={description}
							onChange={e => setDescription(e.target.value)}
						/>
					</div>

					<Button
						type='submit'
						disabled={isLoading || createRelationship.isPending || !sourceModelId || !targetModelId}
					>
						{createRelationship.isPending ? 'Adding...' : 'Add Relationship'}
					</Button>
				</form>
			</CardContent>
		</Card>
	)
}
