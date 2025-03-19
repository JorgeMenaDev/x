import { useQuery, queryOptions } from '@tanstack/react-query'
import { Model } from '../types'

// Mock data for the purpose of this exercise
const mockModels: Model[] = [
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

// Base function to get all models
export const getModels = async (): Promise<Model[]> => {
	// In a real application, this would be an API call
	return Promise.resolve(mockModels)
}

// Query options for React Query
export const getModelsQueryOptions = () => {
	return queryOptions({
		queryKey: ['models'],
		queryFn: () => getModels()
	})
}

// Hook for React components
export const useModels = (options: { queryConfig?: any } = {}) => {
	return useQuery({
		...getModelsQueryOptions(),
		...options.queryConfig
	})
}
