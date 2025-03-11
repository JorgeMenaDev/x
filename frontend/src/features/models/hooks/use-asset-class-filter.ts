import { useMemo } from 'react'
import { ModelReferenceData } from '../types'

/**
 * Hook to filter asset classes based on the selected purpose
 * @param modelReferenceData - The model reference data
 * @param purposeId - The selected purpose ID
 * @returns Filtered asset classes
 */
export function useAssetClassFilter(modelReferenceData: ModelReferenceData | undefined, purposeId: string) {
	return useMemo(() => {
		try {
			if (!modelReferenceData) {
				console.log('useAssetClassFilter: modelReferenceData is undefined')
				return []
			}

			if (!purposeId) {
				console.log('useAssetClassFilter: purposeId is empty, returning empty array')
				return []
			}

			if (!modelReferenceData.model_reference_data_level2?.PurposeToAssetClass) {
				console.error('useAssetClassFilter: PurposeToAssetClass is undefined')
				return []
			}

			if (!modelReferenceData.AssetClass) {
				console.error('useAssetClassFilter: AssetClass is undefined')
				return []
			}

			// Get all asset class IDs related to the selected purpose
			const relatedAssetClassIds = modelReferenceData.model_reference_data_level2.PurposeToAssetClass.filter(
				relation => relation.purpose_id.toString() === purposeId
			).map(relation => relation.assetclass_id)

			console.log(
				`useAssetClassFilter: Found ${relatedAssetClassIds.length} related asset classes for purpose ${purposeId}`
			)

			// Filter asset classes based on the related IDs
			return modelReferenceData.AssetClass.filter(assetClass => relatedAssetClassIds.includes(assetClass.assetclass_id))
		} catch (error) {
			console.error('Error in useAssetClassFilter:', error)
			return []
		}
	}, [modelReferenceData, purposeId])
}
