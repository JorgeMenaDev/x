import { useQuery, useQueries } from '@tanstack/react-query'
import {
	fetchAllModelReferenceData,
	fetchModelTypes,
	fetchModelPurposes,
	fetchUses,
	fetchAssetClasses,
	fetchSubgroups,
	fetchPurposeToUse,
	fetchSubgroupToUse,
	fetchPurposeToAssetClass,
	type ModelReferenceData
} from '@/lib/api-client'

/**
 * Hook for fetching all model reference data in a single query
 * @returns Query result with all model reference data
 */
export function useAllModelReferenceData() {
	return useQuery({
		queryKey: ['modelReferenceData'],
		queryFn: fetchAllModelReferenceData
	})
}

/**
 * Hook for fetching individual model reference data tables separately
 * This allows for more granular loading states and error handling
 * @returns Object with individual query results for each table
 */
export function useSeparateModelReferenceData() {
	const queries = useQueries({
		queries: [
			{
				queryKey: ['modelReferenceData', 'modelTypes'],
				queryFn: fetchModelTypes
			},
			{
				queryKey: ['modelReferenceData', 'modelPurposes'],
				queryFn: fetchModelPurposes
			},
			{
				queryKey: ['modelReferenceData', 'uses'],
				queryFn: fetchUses
			},
			{
				queryKey: ['modelReferenceData', 'assetClasses'],
				queryFn: fetchAssetClasses
			},
			{
				queryKey: ['modelReferenceData', 'subgroups'],
				queryFn: fetchSubgroups
			},
			{
				queryKey: ['modelReferenceData', 'purposeToUse'],
				queryFn: fetchPurposeToUse
			},
			{
				queryKey: ['modelReferenceData', 'subgroupToUse'],
				queryFn: fetchSubgroupToUse
			},
			{
				queryKey: ['modelReferenceData', 'purposeToAssetClass'],
				queryFn: fetchPurposeToAssetClass
			}
		]
	})

	const [
		modelTypesQuery,
		modelPurposesQuery,
		usesQuery,
		assetClassesQuery,
		subgroupsQuery,
		purposeToUseQuery,
		subgroupToUseQuery,
		purposeToAssetClassQuery
	] = queries

	// Combine the data into the expected structure when all queries are successful
	const isSuccess = queries.every(query => query.isSuccess)
	const isLoading = queries.some(query => query.isLoading)
	const isError = queries.some(query => query.isError)
	const error = queries.find(query => query.error)?.error

	// Combine the data into the expected structure
	const data: ModelReferenceData | undefined = isSuccess
		? {
				QModelType: modelTypesQuery.data || [],
				QModelPurpose: modelPurposesQuery.data || [],
				Uses: usesQuery.data || [],
				AssetClass: assetClassesQuery.data || [],
				Subgroup: subgroupsQuery.data || [],
				model_reference_data_level2: {
					PurposeToUse: purposeToUseQuery.data || [],
					SubgroupToUse: subgroupToUseQuery.data || [],
					PurposeToAssetClass: purposeToAssetClassQuery.data || []
				}
		  }
		: undefined

	return {
		data,
		isLoading,
		isSuccess,
		isError,
		error,
		queries: {
			modelTypesQuery,
			modelPurposesQuery,
			usesQuery,
			assetClassesQuery,
			subgroupsQuery,
			purposeToUseQuery,
			subgroupToUseQuery,
			purposeToAssetClassQuery
		}
	}
}
