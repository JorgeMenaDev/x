// Define types for the model reference data structures
export interface ModelType {
	qm_type_id: number
	qm_type: string
	created_at?: string
	updated_at?: string
}

export interface ModelPurpose {
	purpose_id: number
	purpose: string
	created_at?: string
	updated_at?: string
}

export interface Use {
	use_id: number
	use: string
	created_at?: string
	updated_at?: string
}

export interface AssetClass {
	assetclass_id: number
	assetclass: string
	created_at?: string
	updated_at?: string
}

export interface Subgroup {
	subgroup_id: number
	subgroup: string
	created_at?: string
	updated_at?: string
}

export interface PurposeToUse {
	purpose_id: number
	use_id: number
}

export interface SubgroupToUse {
	subgroup_id: number
	use_id: number
}

export interface PurposeToAssetClass {
	purpose_id: number
	assetclass_id: number
}

export interface ModelReferenceData {
	QModelType: Pick<ModelType, 'qm_type_id' | 'qm_type'>[]
	QModelPurpose: Pick<ModelPurpose, 'purpose_id' | 'purpose'>[]
	Uses: Pick<Use, 'use_id' | 'use'>[]
	AssetClass: Pick<AssetClass, 'assetclass_id' | 'assetclass'>[]
	Subgroup: Pick<Subgroup, 'subgroup_id' | 'subgroup'>[]
	model_reference_data_level2: {
		PurposeToUse: Pick<PurposeToUse, 'purpose_id' | 'use_id'>[]
		SubgroupToUse: Pick<SubgroupToUse, 'subgroup_id' | 'use_id'>[]
		PurposeToAssetClass: Pick<PurposeToAssetClass, 'purpose_id' | 'assetclass_id'>[]
	}
}

// Define the form schema for model reference
export interface ModelReferenceFormValues {
	uniqueReference: string
	modelName: string
	modelType: string
	purpose: string
	owner: string
	accountableExec: string
	modelUses: {
		subgroup: string
		use: string
		assetClass: string
		execUsage: string
		user: string
	}[]
}

// Define the API request payload for creating a model
export interface CreateModelPayload {
	uniqueReference: string
	modelName: string
	modelType: number
	purpose: number
	owner: string
	accountableExec: string
	modelUses: {
		subgroup: number
		use: number
		assetClass: number
		execUsage: string
		user: string
	}[]
}
