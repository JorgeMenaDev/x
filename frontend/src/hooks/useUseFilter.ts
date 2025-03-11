import { ModelReferenceData } from '@/lib/api'

/**
 * Hook to filter uses based on the selected purpose
 * @param modelReferenceData - The model reference data
 * @param purposeId - The selected purpose ID
 * @returns Filtered uses
 */
export function useUseFilter(modelReferenceData: ModelReferenceData | undefined, purposeId: string) {
	// If no data or no purpose selected, return empty array or all uses
	if (!modelReferenceData) return []
	if (!purposeId) return modelReferenceData.Uses

	try {
		// Convert purposeId to number for comparison
		const purposeIdNum = parseInt(purposeId, 10)
		if (isNaN(purposeIdNum)) return modelReferenceData.Uses

		// Get the relationships between purposes and uses
		const purposeToUseRelations = modelReferenceData.model_reference_data_level2.PurposeToUse

		// Filter the relationships for the selected purpose
		const filteredRelations = purposeToUseRelations.filter(
			relation => relation.purpose_id === purposeIdNum || relation.purpose_id.toString() === purposeId
		)

		// If no relations found, return all uses as fallback
		if (filteredRelations.length === 0) return modelReferenceData.Uses

		// Extract the use IDs from the filtered relationships
		const useIds = filteredRelations.map(relation => relation.use_id)

		// Filter the uses to only include those with IDs in the useIds array
		const filteredUses = modelReferenceData.Uses.filter(use =>
			useIds.some(id => use.use_id === id || use.use_id.toString() === id.toString())
		)

		// If no uses are found, return all uses as a fallback
		return filteredUses.length > 0 ? filteredUses : modelReferenceData.Uses
	} catch (err) {
		// Return all uses as a fallback in case of error
		console.error('Error filtering uses:', err)
		return modelReferenceData.Uses
	}
}
