import { api } from '@/lib/api-client'
import {
	ModelType,
	ModelPurpose,
	Use,
	AssetClass,
	Subgroup,
	PurposeToUse,
	SubgroupToUse,
	PurposeToAssetClass,
	ModelReferenceData
} from '../types'

/**
 * Fetches data from a specific table
 * @param tableName - The name of the table to fetch data from
 * @param limit - The maximum number of items to fetch
 * @returns The data from the table
 */
export async function fetchTableData<T>(tableName: string, limit: number = 100): Promise<T[]> {
	try {
		const url = `/api/v1/inventory/data/${tableName}?limit=${limit}`

		const response = await api.get(url)

		if (
			response.data &&
			typeof response.data === 'object' &&
			'data' in response.data &&
			Array.isArray(response.data.data)
		) {
			console.log(`Successfully fetched ${response.data.data.length} items from ${tableName} (paginated format)`)
			return response.data.data
		}

		// Handle direct array response
		if (response.data && Array.isArray(response.data)) {
			console.log(`Successfully fetched ${response.data.length} items from ${tableName} (direct array format)`)
			return response.data
		}

		// If we get here, the response format is invalid
		console.error(`Invalid response format from ${tableName}:`, response.data)

		// Create a more detailed error message
		let errorDetails = 'Unknown format'
		if (response.data) {
			errorDetails = `Received: ${typeof response.data}`
			if (typeof response.data === 'object') {
				errorDetails += `, Keys: [${Object.keys(response.data).join(', ')}]`
			}
		}

		throw new Error(`Invalid response format from ${tableName}: ${errorDetails}`)
	} catch (error) {
		console.error(`Error fetching data from ${tableName}:`, error)
		throw error
	}
}

/**
 * Fetches model types from the qm_model_type table
 * @returns Array of model types
 */
export async function fetchModelTypes(): Promise<Pick<ModelType, 'qm_type_id' | 'qm_type'>[]> {
	try {
		const data = await fetchTableData<ModelType>('qm_model_type')
		return data.map(item => ({
			qm_type: item.qm_type,
			qm_type_id: item.qm_type_id
		}))
	} catch (error) {
		console.error('Error in fetchModelTypes:', error)
		throw error
	}
}

/**
 * Fetches model purposes from the qm_model_purpose table
 * @returns Array of model purposes
 */
export async function fetchModelPurposes(): Promise<Pick<ModelPurpose, 'purpose_id' | 'purpose'>[]> {
	try {
		const data = await fetchTableData<ModelPurpose>('qm_model_purpose')
		return data.map(item => ({
			purpose: item.purpose,
			purpose_id: item.purpose_id
		}))
	} catch (error) {
		console.error('Error in fetchModelPurposes:', error)
		throw error
	}
}

/**
 * Fetches uses from the qm_uses table
 * @returns Array of uses
 */
export async function fetchUses(): Promise<Pick<Use, 'use_id' | 'use'>[]> {
	try {
		const data = await fetchTableData<Use>('qm_uses')
		return data.map(item => ({
			use: item.use,
			use_id: item.use_id
		}))
	} catch (error) {
		console.error('Error in fetchUses:', error)
		throw error
	}
}

/**
 * Fetches asset classes from the qm_asset_class table
 * @returns Array of asset classes
 */
export async function fetchAssetClasses(): Promise<Pick<AssetClass, 'assetclass_id' | 'assetclass'>[]> {
	try {
		const data = await fetchTableData<AssetClass>('qm_asset_class')
		return data.map(item => ({
			assetclass: item.assetclass,
			assetclass_id: item.assetclass_id
		}))
	} catch (error) {
		console.error('Error in fetchAssetClasses:', error)
		throw error
	}
}

/**
 * Fetches subgroups from the qm_subgroup table
 * @returns Array of subgroups
 */
export async function fetchSubgroups(): Promise<Pick<Subgroup, 'subgroup_id' | 'subgroup'>[]> {
	try {
		const data = await fetchTableData<Subgroup>('qm_subgroup')
		return data.map(item => ({
			subgroup: item.subgroup,
			subgroup_id: item.subgroup_id
		}))
	} catch (error) {
		console.error('Error in fetchSubgroups:', error)
		throw error
	}
}

/**
 * Fetches purpose to use relationships from the qm_purpose_to_use table
 * @returns Array of purpose to use relationships
 */
export async function fetchPurposeToUse(): Promise<Pick<PurposeToUse, 'purpose_id' | 'use_id'>[]> {
	try {
		const data = await fetchTableData<PurposeToUse>('qm_purpose_to_use')
		return data.map(item => ({
			purpose_id: item.purpose_id,
			use_id: item.use_id
		}))
	} catch (error) {
		console.error('Error in fetchPurposeToUse:', error)
		throw error
	}
}

/**
 * Fetches subgroup to use relationships from the qm_subgroup_to_use table
 * @returns Array of subgroup to use relationships
 */
export async function fetchSubgroupToUse(): Promise<Pick<SubgroupToUse, 'subgroup_id' | 'use_id'>[]> {
	try {
		const data = await fetchTableData<SubgroupToUse>('qm_subgroup_to_use')
		return data.map(item => ({
			subgroup_id: item.subgroup_id,
			use_id: item.use_id
		}))
	} catch (error) {
		console.error('Error in fetchSubgroupToUse:', error)
		throw error
	}
}

/**
 * Fetches purpose to asset class relationships from the qm_purpose_to_asset_class table
 * @returns Array of purpose to asset class relationships
 */
export async function fetchPurposeToAssetClass(): Promise<Pick<PurposeToAssetClass, 'purpose_id' | 'assetclass_id'>[]> {
	try {
		const data = await fetchTableData<PurposeToAssetClass>('qm_purpose_to_asset_class')
		return data.map(item => ({
			purpose_id: item.purpose_id,
			assetclass_id: item.assetclass_id
		}))
	} catch (error) {
		console.error('Error in fetchPurposeToAssetClass:', error)
		throw error
	}
}

/**
 * Fetches all model reference data in a single call
 * @returns All model reference data
 */
export async function fetchAllModelReferenceData(): Promise<ModelReferenceData> {
	try {
		console.log('Fetching all model reference data')
		const [modelTypes, modelPurposes, uses, assetClasses, subgroups, purposeToUse, subgroupToUse, purposeToAssetClass] =
			await Promise.all([
				fetchModelTypes(),
				fetchModelPurposes(),
				fetchUses(),
				fetchAssetClasses(),
				fetchSubgroups(),
				fetchPurposeToUse(),
				fetchSubgroupToUse(),
				fetchPurposeToAssetClass()
			])

		const result = {
			QModelType: modelTypes,
			QModelPurpose: modelPurposes,
			Uses: uses,
			AssetClass: assetClasses,
			Subgroup: subgroups,
			model_reference_data_level2: {
				PurposeToUse: purposeToUse,
				SubgroupToUse: subgroupToUse,
				PurposeToAssetClass: purposeToAssetClass
			}
		}

		console.log('Successfully fetched all model reference data')
		return result
	} catch (error) {
		console.error('Error in fetchAllModelReferenceData:', error)
		throw error
	}
}
