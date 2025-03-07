import { ModelReferenceData } from '@/lib/api'

/**
 * Hook to filter asset classes based on the selected purpose
 * @param modelReferenceData - The model reference data
 * @param purposeId - The selected purpose ID
 * @returns Filtered asset classes
 */
export function useAssetClassFilter(modelReferenceData: ModelReferenceData | undefined, purposeId: string) {
	console.log('useAssetClassFilter called with purposeId:', purposeId)
	console.log('modelReferenceData available:', !!modelReferenceData)

	// If no data or no purpose selected, return empty array
	if (!modelReferenceData) {
		console.log('No model reference data')
		return []
	}

	if (!purposeId) {
		console.log('No purpose ID selected, returning all asset classes')
		return modelReferenceData.AssetClass
	}

	console.log('Asset classes in data:', modelReferenceData.AssetClass)
	console.log('Purpose to asset class relations:', modelReferenceData.model_reference_data_level2.PurposeToAssetClass)

	try {
		// Convert purposeId to number for comparison with database values
		const purposeIdNum = parseInt(purposeId, 10)
		console.log('Converted purposeId to number:', purposeIdNum)

		if (isNaN(purposeIdNum)) {
			console.log('Invalid purpose ID, returning all asset classes')
			return modelReferenceData.AssetClass
		}

		// Get the relationships between purposes and asset classes
		const purposeToAssetClassRelations = modelReferenceData.model_reference_data_level2.PurposeToAssetClass

		// Filter the relationships to only include those for the selected purpose
		// Check both number and string equality to handle different data formats
		const filteredRelations = purposeToAssetClassRelations.filter(
			relation => relation.purpose_id === purposeIdNum || relation.purpose_id.toString() === purposeId
		)
		console.log('Filtered relations for purpose:', filteredRelations)

		// If no relations found, return all asset classes
		if (filteredRelations.length === 0) {
			console.log('No relations found for purpose ID:', purposeIdNum)
			return modelReferenceData.AssetClass
		}

		// Extract the asset class IDs from the filtered relationships
		const assetClassIds = filteredRelations.map(relation => relation.assetclass_id)
		console.log('Asset class IDs for selected purpose:', assetClassIds)

		// Filter the asset classes to only include those with IDs in the assetClassIds array
		// Check both number and string equality to handle different data formats
		const filteredAssetClasses = modelReferenceData.AssetClass.filter(assetClass =>
			assetClassIds.some(id => assetClass.assetclass_id === id || assetClass.assetclass_id.toString() === id.toString())
		)

		console.log('Final filtered asset classes:', filteredAssetClasses)

		// If no asset classes are found, return all asset classes as a fallback
		if (filteredAssetClasses.length === 0) {
			console.log('No asset classes found for the selected purpose, returning all asset classes')
			return modelReferenceData.AssetClass
		}

		return filteredAssetClasses
	} catch (err) {
		console.error('Error filtering asset classes:', err)
		// Return all asset classes as a fallback in case of error
		return modelReferenceData.AssetClass
	}
}
