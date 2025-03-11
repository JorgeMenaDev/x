import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { useNotifications } from '@/components/notifications/notifications-store'

// Match backend error structure
interface APIErrorResponse {
	error: boolean
	code: string
	message: string
	details?: unknown
	stack?: string
}

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
	if (config.headers) {
		config.headers.Accept = 'application/json'
		config.headers['Content-Type'] = 'application/json'
	}

	return config
}

export const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
	headers: {
		'Content-Type': 'application/json'
	}
})

api.interceptors.request.use(authRequestInterceptor)
api.interceptors.response.use(
	response => {
		return response.data
	},
	(error: AxiosError<APIErrorResponse>) => {
		const apiError = error.response?.data
		const statusCode = error.response?.status
		const errorMessage = apiError
			? `${apiError.message} ${apiError.details ? `(${JSON.stringify(apiError.details)})` : ''}`
			: error.message

		useNotifications.getState().addNotification({
			type: 'error',
			title: apiError?.code || 'Error',
			message: `${errorMessage}${statusCode ? ` (Status: ${statusCode})` : ''}`
		})

		return Promise.reject(error)
	}
)

// Type-safe API instance
export interface ApiConfig {
	params?: Record<string, string>
	headers?: Record<string, string>
	data?: unknown // Add support for request body in DELETE requests
}

export type ApiInstance = {
	get<T>(url: string, config?: ApiConfig): Promise<T>
	post<T>(url: string, data?: unknown, config?: ApiConfig): Promise<T>
	put<T>(url: string, data?: unknown, config?: ApiConfig): Promise<T>
	delete<T>(url: string, config?: ApiConfig): Promise<T>
}

export const typedApi = api as unknown as ApiInstance

/**
 * Model Reference Data Types
 */

// Define types for the data structures
interface ModelType {
	qm_type_id: number
	qm_type: string
	created_at?: string
	updated_at?: string
}

interface ModelPurpose {
	purpose_id: number
	purpose: string
	created_at?: string
	updated_at?: string
}

interface Use {
	use_id: number
	use: string
	created_at?: string
	updated_at?: string
}

interface AssetClass {
	assetclass_id: number
	assetclass: string
	created_at?: string
	updated_at?: string
}

interface Subgroup {
	subgroup_id: number
	subgroup: string
	created_at?: string
	updated_at?: string
}

interface PurposeToUse {
	id?: number
	purpose_id: number
	use_id: number
	created_at?: string
	updated_at?: string
}

interface SubgroupToUse {
	id?: number
	subgroup_id: number
	use_id: number
	created_at?: string
	updated_at?: string
}

interface PurposeToAssetClass {
	id?: number
	purpose_id: number
	assetclass_id: number
	created_at?: string
	updated_at?: string
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

/**
 * API Functions for Model Reference Data
 */

/**
 * Fetches data from a specific table
 * @param tableName - The name of the table to fetch data from
 * @param limit - The maximum number of items to fetch
 * @returns The data from the table
 */
export async function fetchTableData<T>(tableName: string, limit: number = 100): Promise<T[]> {
	return typedApi
		.get<{ data: T[] }>(`/api/v1/inventory/data/${tableName}?limit=${limit}`)
		.then(response => response.data)
}

/**
 * Fetches model types from the qm_model_type table
 * @returns Array of model types
 */
export async function fetchModelTypes(): Promise<Pick<ModelType, 'qm_type_id' | 'qm_type'>[]> {
	const data = await fetchTableData<ModelType>('qm_model_type')
	return data.map(item => ({
		qm_type: item.qm_type,
		qm_type_id: item.qm_type_id
	}))
}

/**
 * Fetches model purposes from the qm_model_purpose table
 * @returns Array of model purposes
 */
export async function fetchModelPurposes(): Promise<Pick<ModelPurpose, 'purpose_id' | 'purpose'>[]> {
	const data = await fetchTableData<ModelPurpose>('qm_model_purpose')
	return data.map(item => ({
		purpose: item.purpose,
		purpose_id: item.purpose_id
	}))
}

/**
 * Fetches uses from the qm_uses table
 * @returns Array of uses
 */
export async function fetchUses(): Promise<Pick<Use, 'use_id' | 'use'>[]> {
	const data = await fetchTableData<Use>('qm_uses')
	return data.map(item => ({
		use: item.use,
		use_id: item.use_id
	}))
}

/**
 * Fetches asset classes from the qm_asset_class table
 * @returns Array of asset classes
 */
export async function fetchAssetClasses(): Promise<Pick<AssetClass, 'assetclass_id' | 'assetclass'>[]> {
	const data = await fetchTableData<AssetClass>('qm_asset_class')
	return data.map(item => ({
		assetclass: item.assetclass,
		assetclass_id: item.assetclass_id
	}))
}

/**
 * Fetches subgroups from the qm_subgroup table
 * @returns Array of subgroups
 */
export async function fetchSubgroups(): Promise<Pick<Subgroup, 'subgroup_id' | 'subgroup'>[]> {
	const data = await fetchTableData<Subgroup>('qm_subgroup')
	return data.map(item => ({
		subgroup: item.subgroup,
		subgroup_id: item.subgroup_id
	}))
}

/**
 * Fetches purpose to use relationships from the qm_purpose_to_use table
 * @returns Array of purpose to use relationships
 */
export async function fetchPurposeToUse(): Promise<Pick<PurposeToUse, 'purpose_id' | 'use_id'>[]> {
	const data = await fetchTableData<PurposeToUse>('qm_purpose_to_use')
	return data.map(item => ({
		purpose_id: item.purpose_id,
		use_id: item.use_id
	}))
}

/**
 * Fetches subgroup to use relationships from the qm_subgroup_to_use table
 * @returns Array of subgroup to use relationships
 */
export async function fetchSubgroupToUse(): Promise<Pick<SubgroupToUse, 'subgroup_id' | 'use_id'>[]> {
	const data = await fetchTableData<SubgroupToUse>('qm_subgroup_to_use')
	return data.map(item => ({
		subgroup_id: item.subgroup_id,
		use_id: item.use_id
	}))
}

/**
 * Fetches purpose to asset class relationships from the qm_purpose_to_asset_class table
 * @returns Array of purpose to asset class relationships
 */
export async function fetchPurposeToAssetClass(): Promise<Pick<PurposeToAssetClass, 'purpose_id' | 'assetclass_id'>[]> {
	const data = await fetchTableData<PurposeToAssetClass>('qm_purpose_to_asset_class')
	return data.map(item => ({
		purpose_id: item.purpose_id,
		assetclass_id: item.assetclass_id
	}))
}

/**
 * Fetches all model reference data and combines it into a single object
 * @returns Combined model reference data
 */
export async function fetchAllModelReferenceData(): Promise<ModelReferenceData> {
	const [QModelType, QModelPurpose, Uses, AssetClass, Subgroup, PurposeToUse, SubgroupToUse, PurposeToAssetClass] =
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

	return {
		QModelType,
		QModelPurpose,
		Uses,
		AssetClass,
		Subgroup,
		model_reference_data_level2: {
			PurposeToUse,
			SubgroupToUse,
			PurposeToAssetClass
		}
	}
}
