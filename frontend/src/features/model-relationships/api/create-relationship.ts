import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Model, ModelRelationship } from '../types'
import { getModels } from './get-models'

// Interface for creating a relationship
export interface CreateRelationshipInput {
	sourceModelId: string
	targetModelId: string
	type: 'input' | 'output'
	description?: string
}

// Base function to create a relationship
export const createRelationship = async (input: CreateRelationshipInput): Promise<Model[]> => {
	// In a real application, this would be an API call
	// For now, we'll simulate updating the models in memory

	const models = await getModels()

	// Find the source model
	const sourceModel = models.find(model => model.uniqueReference === input.sourceModelId)
	if (!sourceModel) {
		throw new Error(`Source model with ID ${input.sourceModelId} not found`)
	}

	// Find the target model
	const targetModel = models.find(model => model.uniqueReference === input.targetModelId)
	if (!targetModel) {
		throw new Error(`Target model with ID ${input.targetModelId} not found`)
	}

	// Add the relationship to the source model
	const sourceRelationship: ModelRelationship = {
		modelId: input.targetModelId,
		type: input.type,
		description: input.description
	}

	// Add the inverse relationship to the target model
	const targetRelationship: ModelRelationship = {
		modelId: input.sourceModelId,
		type: input.type === 'input' ? 'output' : 'input',
		description: input.description
	}

	// Check if relationships already exist to avoid duplicates
	const sourceRelationshipExists = sourceModel.relationships.some(
		rel => rel.modelId === input.targetModelId && rel.type === input.type
	)

	const targetRelationshipExists = targetModel.relationships.some(
		rel => rel.modelId === input.sourceModelId && rel.type === (input.type === 'input' ? 'output' : 'input')
	)

	// Only add if they don't exist
	if (!sourceRelationshipExists) {
		sourceModel.relationships.push(sourceRelationship)
	}

	if (!targetRelationshipExists) {
		targetModel.relationships.push(targetRelationship)
	}

	// Return the updated models (in a real app, this would be saved to the backend)
	return models
}

// Hook for React components
export const useCreateRelationship = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: createRelationship,
		onSuccess: () => {
			// Invalidate the models query to refetch with the new relationship
			queryClient.invalidateQueries({ queryKey: ['models'] })
		}
	})
}
