import { useMutation } from '@tanstack/react-query'
import { type CreateModelPayload } from '../types'

// This is a mock function that simulates an API call
// In a real application, this would make an actual HTTP request
async function createModel(data: CreateModelPayload): Promise<{ success: boolean }> {
	// Simulate API delay
	await new Promise(resolve => setTimeout(resolve, 1000))

	// For now, just log the data and return success
	console.log('Creating model with data:', data)
	return { success: true }
}

type UseCreateModelOptions = {
	mutationConfig?: {
		onSuccess?: () => void
		onError?: (error: Error) => void
	}
}

export const useCreateModel = ({ mutationConfig }: UseCreateModelOptions = {}) => {
	return useMutation({
		mutationFn: (data: CreateModelPayload) => createModel(data),
		...mutationConfig
	})
}
