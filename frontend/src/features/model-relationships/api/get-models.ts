import { useQuery, queryOptions } from '@tanstack/react-query'
import { Model } from '../types'

// Mock data for the purpose of this exercise - Model Z as root model
const mockModelsZ: Model[] = [
	{
		uniqueReference: 'MODEL_Z',
		modelName: 'Model Z',
		modelType: 2,
		purpose: 2,
		owner: 'MO1',
		accountableExec: 'MRAE1',
		riskTier: 2,
		lastValidationDate: '2024-01-01',
		nextValidationDate: '2025-01-01',
		validationStatus: 2,
		validationComments: [],
		leadReviewer: '',
		dateOfReview: '',
		typeOfReview: 2,
		reviewReport: [],
		modelUses: [],
		relationships: [
			{ modelId: 'MODEL_P', type: 'output', description: 'Output to Model P' },
			{ modelId: 'MODEL_Q', type: 'output', description: 'Output to Model Q' }
		]
	},
	{
		uniqueReference: 'MODEL_P',
		modelName: 'Model P',
		modelType: 2,
		purpose: 2,
		owner: 'MO1',
		accountableExec: 'MRAE1',
		riskTier: 1,
		lastValidationDate: '2024-01-01',
		nextValidationDate: '2025-01-01',
		validationStatus: 2,
		validationComments: [],
		leadReviewer: '',
		dateOfReview: '',
		typeOfReview: 2,
		reviewReport: [],
		modelUses: [],
		relationships: [
			{ modelId: 'MODEL_Z', type: 'input', description: 'Input from Model Z' },
			{ modelId: 'MODEL_S', type: 'output', description: 'Output to Model S' }
		]
	},
	{
		uniqueReference: 'MODEL_Q',
		modelName: 'Model Q',
		modelType: 2,
		purpose: 2,
		owner: 'MO1',
		accountableExec: 'MRAE1',
		riskTier: 2,
		lastValidationDate: '2024-01-01',
		nextValidationDate: '2025-01-01',
		validationStatus: 2,
		validationComments: [],
		leadReviewer: '',
		dateOfReview: '',
		typeOfReview: 2,
		reviewReport: [],
		modelUses: [],
		relationships: [
			{ modelId: 'MODEL_Z', type: 'input', description: 'Input from Model Z' },
			{ modelId: 'MODEL_S', type: 'input', description: 'Input from Model S' },
			{ modelId: 'MODEL_R', type: 'output', description: 'Output to Model R' }
		]
	},
	{
		uniqueReference: 'MODEL_S',
		modelName: 'Model S',
		modelType: 2,
		purpose: 2,
		owner: 'MO1',
		accountableExec: 'MRAE1',
		riskTier: 2,
		lastValidationDate: '2024-01-01',
		nextValidationDate: '2025-01-01',
		validationStatus: 2,
		validationComments: [],
		leadReviewer: '',
		dateOfReview: '',
		typeOfReview: 2,
		reviewReport: [],
		modelUses: [],
		relationships: [
			{ modelId: 'MODEL_P', type: 'input', description: 'Input from Model P' },
			{ modelId: 'MODEL_Q', type: 'output', description: 'Output to Model Q' }
		]
	},
	{
		uniqueReference: 'MODEL_R',
		modelName: 'Model R',
		modelType: 2,
		purpose: 2,
		owner: 'MO1',
		accountableExec: 'MRAE1',
		riskTier: 2,
		lastValidationDate: '2024-01-01',
		nextValidationDate: '2025-01-01',
		validationStatus: 2,
		validationComments: [],
		leadReviewer: '',
		dateOfReview: '',
		typeOfReview: 2,
		reviewReport: [],
		modelUses: [],
		relationships: [{ modelId: 'MODEL_Q', type: 'input', description: 'Input from Model Q' }]
	}
]

// Mock data with Model A as root
const mockModelsA: Model[] = [
	{
		uniqueReference: 'MODEL_A',
		modelName: 'Model A',
		modelType: 1,
		purpose: 1,
		owner: 'MO2',
		accountableExec: 'MRAE2',
		riskTier: 1,
		lastValidationDate: '2024-02-01',
		nextValidationDate: '2025-02-01',
		validationStatus: 1,
		validationComments: [],
		leadReviewer: '',
		dateOfReview: '',
		typeOfReview: 1,
		reviewReport: [],
		modelUses: [],
		relationships: [
			{ modelId: 'MODEL_B', type: 'output', description: 'Output to Model B' },
			{ modelId: 'MODEL_C', type: 'output', description: 'Output to Model C' }
		]
	},
	{
		uniqueReference: 'MODEL_B',
		modelName: 'Model B',
		modelType: 1,
		purpose: 1,
		owner: 'MO2',
		accountableExec: 'MRAE2',
		riskTier: 2,
		lastValidationDate: '2024-02-05',
		nextValidationDate: '2025-02-05',
		validationStatus: 1,
		validationComments: [],
		leadReviewer: '',
		dateOfReview: '',
		typeOfReview: 1,
		reviewReport: [],
		modelUses: [],
		relationships: [
			{ modelId: 'MODEL_A', type: 'input', description: 'Input from Model A' },
			{ modelId: 'MODEL_D', type: 'output', description: 'Output to Model D' }
		]
	},
	{
		uniqueReference: 'MODEL_C',
		modelName: 'Model C',
		modelType: 1,
		purpose: 1,
		owner: 'MO2',
		accountableExec: 'MRAE2',
		riskTier: 3,
		lastValidationDate: '2024-02-10',
		nextValidationDate: '2025-02-10',
		validationStatus: 2,
		validationComments: [],
		leadReviewer: '',
		dateOfReview: '',
		typeOfReview: 1,
		reviewReport: [],
		modelUses: [],
		relationships: [
			{ modelId: 'MODEL_A', type: 'input', description: 'Input from Model A' },
			{ modelId: 'MODEL_D', type: 'output', description: 'Output to Model D' }
		]
	},
	{
		uniqueReference: 'MODEL_D',
		modelName: 'Model D',
		modelType: 1,
		purpose: 1,
		owner: 'MO2',
		accountableExec: 'MRAE2',
		riskTier: 2,
		lastValidationDate: '2024-02-15',
		nextValidationDate: '2025-02-15',
		validationStatus: 1,
		validationComments: [],
		leadReviewer: '',
		dateOfReview: '',
		typeOfReview: 1,
		reviewReport: [],
		modelUses: [],
		relationships: [
			{ modelId: 'MODEL_B', type: 'input', description: 'Input from Model B' },
			{ modelId: 'MODEL_C', type: 'input', description: 'Input from Model C' }
		]
	}
]

// Mock data with Model X as root
const mockModelsX: Model[] = [
	{
		uniqueReference: 'MODEL_X',
		modelName: 'Model X',
		modelType: 3,
		purpose: 3,
		owner: 'MO3',
		accountableExec: 'MRAE3',
		riskTier: 3,
		lastValidationDate: '2024-03-01',
		nextValidationDate: '2025-03-01',
		validationStatus: 3,
		validationComments: [],
		leadReviewer: '',
		dateOfReview: '',
		typeOfReview: 3,
		reviewReport: [],
		modelUses: [],
		relationships: [
			{ modelId: 'MODEL_Y1', type: 'output', description: 'Output to Model Y1' },
			{ modelId: 'MODEL_Y2', type: 'output', description: 'Output to Model Y2' },
			{ modelId: 'MODEL_Y3', type: 'output', description: 'Output to Model Y3' }
		]
	},
	{
		uniqueReference: 'MODEL_Y1',
		modelName: 'Model Y1',
		modelType: 3,
		purpose: 3,
		owner: 'MO3',
		accountableExec: 'MRAE3',
		riskTier: 2,
		lastValidationDate: '2024-03-05',
		nextValidationDate: '2025-03-05',
		validationStatus: 2,
		validationComments: [],
		leadReviewer: '',
		dateOfReview: '',
		typeOfReview: 3,
		reviewReport: [],
		modelUses: [],
		relationships: [{ modelId: 'MODEL_X', type: 'input', description: 'Input from Model X' }]
	},
	{
		uniqueReference: 'MODEL_Y2',
		modelName: 'Model Y2',
		modelType: 3,
		purpose: 3,
		owner: 'MO3',
		accountableExec: 'MRAE3',
		riskTier: 2,
		lastValidationDate: '2024-03-10',
		nextValidationDate: '2025-03-10',
		validationStatus: 1,
		validationComments: [],
		leadReviewer: '',
		dateOfReview: '',
		typeOfReview: 3,
		reviewReport: [],
		modelUses: [],
		relationships: [{ modelId: 'MODEL_X', type: 'input', description: 'Input from Model X' }]
	},
	{
		uniqueReference: 'MODEL_Y3',
		modelName: 'Model Y3',
		modelType: 3,
		purpose: 3,
		owner: 'MO3',
		accountableExec: 'MRAE3',
		riskTier: 1,
		lastValidationDate: '2024-03-15',
		nextValidationDate: '2025-03-15',
		validationStatus: 1,
		validationComments: [],
		leadReviewer: '',
		dateOfReview: '',
		typeOfReview: 3,
		reviewReport: [],
		modelUses: [],
		relationships: [{ modelId: 'MODEL_X', type: 'input', description: 'Input from Model X' }]
	}
]

// Model sets organized by root model ID
const modelSets: Record<string, Model[]> = {
	MODEL_Z: mockModelsZ,
	MODEL_A: mockModelsA,
	MODEL_X: mockModelsX
}

// Root models for dropdown selection
export const rootModels = [
	{ id: 'MODEL_Z', name: 'Model Z' },
	{ id: 'MODEL_A', name: 'Model A' },
	{ id: 'MODEL_X', name: 'Model X' }
]

// Base function to get all models for a specific root model ID
export const getModelsByRoot = async (rootModelId: string = 'MODEL_Z'): Promise<Model[]> => {
	// In a real application, this would be an API call with filtering
	return Promise.resolve(modelSets[rootModelId] || mockModelsZ)
}

// Original function kept for backward compatibility
export const getModels = async (): Promise<Model[]> => {
	return getModelsByRoot('MODEL_Z')
}

// Query options for React Query with root model parameter
export const getModelsByRootQueryOptions = (rootModelId: string) => {
	return queryOptions({
		queryKey: ['models', rootModelId],
		queryFn: () => getModelsByRoot(rootModelId)
	})
}

// Hook for React components with root model selection
export const useModelsByRoot = (rootModelId: string, options: { queryConfig?: any } = {}) => {
	return useQuery({
		...getModelsByRootQueryOptions(rootModelId),
		...options.queryConfig
	})
}

// Original hook kept for backward compatibility
export const useModels = (options: { queryConfig?: any } = {}) => {
	return useQuery({
		...getModelsQueryOptions(),
		...options.queryConfig
	})
}

// Query options for React Query - original function kept for backward compatibility
export const getModelsQueryOptions = () => {
	return queryOptions({
		queryKey: ['models'],
		queryFn: () => getModels()
	})
}
