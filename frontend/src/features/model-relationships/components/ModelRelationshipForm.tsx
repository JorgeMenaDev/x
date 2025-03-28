'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { useModels } from '../api/get-models'
import { useCreateRelationship, CreateRelationshipInput } from '../api/create-relationship'
import { Model } from '../types'
import { Badge } from '@/components/ui/badge'

interface ModelRelationshipFormProps {
	initialSourceModelId?: string
	sourceModelName?: string
	onRelationshipCreated?: () => void
}

export default function ModelRelationshipForm({
	initialSourceModelId,
	sourceModelName,
	onRelationshipCreated
}: ModelRelationshipFormProps) {
	const { data, isLoading } = useModels()
	const models = (data ?? []) as Model[]
	const createRelationship = useCreateRelationship()

	const [sourceModelId, setSourceModelId] = useState<string>(initialSourceModelId || '')
	const [targetModelId, setTargetModelId] = useState<string>('')
	const [relationshipType, setRelationshipType] = useState<'input' | 'output'>('output')
	const [description, setDescription] = useState<string>('')

	// Update source model if initialSourceModelId changes
	useEffect(() => {
		if (initialSourceModelId) {
			setSourceModelId(initialSourceModelId)
		}
	}, [initialSourceModelId])

	// Use the provided sourceModelName or find it in the models if not provided
	const displayModelName = React.useMemo(() => {
		if (sourceModelName) return sourceModelName

		if (!sourceModelId || models.length === 0) return null

		const model = models.find(
			m =>
				m.uniqueReference === sourceModelId || (m as any).id === sourceModelId || (m as any).model_id === sourceModelId
		)

		return model?.modelName || null
	}, [sourceModelId, models, sourceModelName])

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
				// Don't reset sourceModelId since it's fixed
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
		<Card className='border-0 shadow-none'>
			<CardContent>
				<form onSubmit={handleSubmit} className='space-y-6 pt-4'>
					<div className='space-y-2'>
						<Label htmlFor='sourceModel'>Source Model</Label>
						{initialSourceModelId ? (
							<div className='flex items-center gap-2 mt-1 h-10 px-3 py-2 rounded-md border border-input bg-background'>
								{displayModelName ? (
									<Badge className='font-medium bg-primary/10 text-primary border-primary/20 hover:bg-primary/20'>
										{displayModelName}
									</Badge>
								) : (
									<div className='text-muted-foreground'>Loading model...</div>
								)}
							</div>
						) : (
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
						)}
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
						className='w-full'
						disabled={isLoading || createRelationship.isPending || !sourceModelId || !targetModelId}
					>
						{createRelationship.isPending ? 'Adding...' : 'Add Relationship'}
					</Button>
				</form>
			</CardContent>
		</Card>
	)
}
