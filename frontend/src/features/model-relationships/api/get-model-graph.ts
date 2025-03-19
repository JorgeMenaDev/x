import { Model, ModelGraph, ModelNode, ModelEdge } from '../types'
import { getModels, getModelsByRoot, rootModels } from './get-models'
import { useQuery, queryOptions } from '@tanstack/react-query'

// Base function to convert models to graph structure
export const getModelGraph = async (): Promise<ModelGraph> => {
	const models = await getModels()

	// Create nodes from models
	const nodes: ModelNode[] = models.map(model => ({
		id: model.uniqueReference,
		name: model.modelName,
		type: model.modelType,
		purpose: model.purpose,
		owner: model.owner,
		accountableExec: model.accountableExec
	}))

	// Create edges from relationships
	const edges: ModelEdge[] = []

	// Process each model's relationships
	models.forEach(model => {
		// Only process output relationships to avoid duplicates
		const outputRelationships = model.relationships.filter(rel => rel.type === 'output')

		outputRelationships.forEach(rel => {
			edges.push({
				source: model.uniqueReference,
				target: rel.modelId,
				type: 'output',
				description: rel.description
			})
		})
	})

	return { nodes, edges }
}

// Function to get graph data for a specific root model
export const getModelGraphByRoot = async (rootModelId: string): Promise<ModelGraph> => {
	const models = await getModelsByRoot(rootModelId)

	// Create nodes from models
	const nodes: ModelNode[] = models.map(model => ({
		id: model.uniqueReference,
		name: model.modelName,
		type: model.modelType,
		purpose: model.purpose,
		owner: model.owner,
		accountableExec: model.accountableExec
	}))

	// Create edges from relationships
	const edges: ModelEdge[] = []

	// Process each model's relationships
	models.forEach(model => {
		// Only process output relationships to avoid duplicates
		const outputRelationships = model.relationships.filter(rel => rel.type === 'output')

		outputRelationships.forEach(rel => {
			edges.push({
				source: model.uniqueReference,
				target: rel.modelId,
				type: 'output',
				description: rel.description
			})
		})
	})

	return { nodes, edges }
}

// Function to get all root models
export const getRootModels = async () => {
	return Promise.resolve(rootModels)
}

// Query options for React Query - for root models
export const getRootModelsQueryOptions = () => {
	return queryOptions({
		queryKey: ['rootModels'],
		queryFn: () => getRootModels()
	})
}

// Hook for getting root models
export const useRootModels = () => {
	return useQuery({
		...getRootModelsQueryOptions()
	})
}

// Query options for React Query
export const getModelGraphQueryOptions = () => {
	return queryOptions({
		queryKey: ['modelGraph'],
		queryFn: () => getModelGraph()
	})
}

// Query options for React Query with root model parameter
export const getModelGraphByRootQueryOptions = (rootModelId: string) => {
	return queryOptions({
		queryKey: ['modelGraph', rootModelId],
		queryFn: () => getModelGraphByRoot(rootModelId)
	})
}

// Hook for React components
export const useModelGraph = (options: { queryConfig?: any } = {}) => {
	return useQuery({
		...getModelGraphQueryOptions(),
		...options.queryConfig
	})
}

// Hook for React components with root model selection
export const useModelGraphByRoot = (rootModelId: string, options: { queryConfig?: any } = {}) => {
	return useQuery({
		...getModelGraphByRootQueryOptions(rootModelId),
		...options.queryConfig
	})
}
