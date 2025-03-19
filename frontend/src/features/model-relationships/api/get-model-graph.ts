import { Model, ModelGraph, ModelNode, ModelEdge } from '../types'
import { getModels } from './get-models'
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

// Query options for React Query
export const getModelGraphQueryOptions = () => {
	return queryOptions({
		queryKey: ['modelGraph'],
		queryFn: () => getModelGraph()
	})
}

// Hook for React components
export const useModelGraph = (options: { queryConfig?: any } = {}) => {
	return useQuery({
		...getModelGraphQueryOptions(),
		...options.queryConfig
	})
}
