import { useQueries, useQuery } from '@tanstack/react-query'
import {
	fetchAllModelReferenceData,
	fetchAssetClasses,
	fetchModelPurposes,
	fetchModelTypes,
	fetchPurposeToAssetClass,
	fetchPurposeToUse,
	fetchSubgroupToUse,
	fetchSubgroups,
	fetchUses
} from '../api/model-reference-data'
import { ModelReferenceData } from '../types'

/**
 * Hook to fetch all model reference data in a single query
 * @returns The model reference data
 */
export function useModelReferenceData() {
	return useQuery({
		queryKey: ['modelReferenceData'],
		queryFn: fetchAllModelReferenceData
	})
}

/**
 * Hook to fetch all model reference data in separate queries
 * This allows for more granular error handling and loading states
 * @returns The model reference data
 */
export function useSeparateModelReferenceData() {
	const queries = useQueries({
		queries: [
			{
				queryKey: ['modelTypes'],
				queryFn: fetchModelTypes,
				retry: 2
			},
			{
				queryKey: ['modelPurposes'],
				queryFn: fetchModelPurposes,
				retry: 2
			},
			{
				queryKey: ['uses'],
				queryFn: fetchUses,
				retry: 2
			},
			{
				queryKey: ['assetClasses'],
				queryFn: fetchAssetClasses,
				retry: 2
			},
			{
				queryKey: ['subgroups'],
				queryFn: fetchSubgroups,
				retry: 2
			},
			{
				queryKey: ['purposeToUse'],
				queryFn: fetchPurposeToUse,
				retry: 2
			},
			{
				queryKey: ['subgroupToUse'],
				queryFn: fetchSubgroupToUse,
				retry: 2
			},
			{
				queryKey: ['purposeToAssetClass'],
				queryFn: fetchPurposeToAssetClass,
				retry: 2
			}
		]
	})

	// Check if any query has an error
	const hasError = queries.some(query => query.isError)

	// Log errors for debugging
	if (hasError) {
		console.error('Error in one or more model reference data queries')
		queries.forEach(query => {
			if (query.isError) {
				console.error('Error in query:', query.error)
			}
		})
	}

	// Check if all queries are successful
	const isSuccess = queries.every(query => query.isSuccess)

	// Check if any query is loading
	const isLoading = queries.some(query => query.isLoading)

	// Create a combined data object
	const data: ModelReferenceData | undefined = isSuccess
		? {
				QModelType: queries[0].data || [],
				QModelPurpose: queries[1].data || [],
				Uses: queries[2].data || [],
				AssetClass: queries[3].data || [],
				Subgroup: queries[4].data || [],
				model_reference_data_level2: {
					PurposeToUse: queries[5].data || [],
					SubgroupToUse: queries[6].data || [],
					PurposeToAssetClass: queries[7].data || []
				}
		  }
		: undefined

	// If we have partial data (some queries succeeded but others failed),
	// provide a fallback with empty arrays for the failed queries
	const fallbackData: ModelReferenceData | undefined =
		!isSuccess && !isLoading
			? {
					QModelType: queries[0].data || [],
					QModelPurpose: queries[1].data || [],
					Uses: queries[2].data || [],
					AssetClass: queries[3].data || [],
					Subgroup: queries[4].data || [],
					model_reference_data_level2: {
						PurposeToUse: queries[5].data || [],
						SubgroupToUse: queries[6].data || [],
						PurposeToAssetClass: queries[7].data || []
					}
			  }
			: undefined

	// Get the first error that occurred
	const error = queries.find(query => query.isError)?.error

	return {
		data: data || fallbackData,
		isLoading,
		isError: hasError,
		error
	}
}
