import { useMemo } from 'react'
import { ModelReferenceData } from '../types'

/**
 * Hook to filter uses based on the selected purpose
 * @param modelReferenceData - The model reference data
 * @param purposeId - The selected purpose ID
 * @returns Filtered uses
 */
export function useUseFilter(modelReferenceData: ModelReferenceData | undefined, purposeId: string) {
	return useMemo(() => {
		if (!modelReferenceData || !purposeId) {
			return []
		}

		// Check if required properties exist
		if (!modelReferenceData.model_reference_data_level2?.PurposeToUse || !modelReferenceData.Uses) {
			console.error('Missing required data in useUseFilter')
			return []
		}

		// Get all use IDs related to the selected purpose
		const relatedUseIds = modelReferenceData.model_reference_data_level2.PurposeToUse.filter(
			relation => relation.purpose_id.toString() === purposeId
		).map(relation => relation.use_id)

		// Filter uses based on the related IDs
		return modelReferenceData.Uses.filter(use => relatedUseIds.includes(use.use_id))
	}, [modelReferenceData, purposeId])
}
