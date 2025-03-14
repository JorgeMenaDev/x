import { typedApi } from '@/lib/api-client'

export interface ModelRiskTier {
	tier: string
	validation_frequency: number
	description: string
	alert_threshold: number
	created_at?: string
	updated_at?: string
}

export interface ModelRiskTiersResponse {
	data: ModelRiskTier[]
}

export async function fetchModelRiskTiers(): Promise<ModelRiskTier[]> {
	const response = await typedApi.get<ModelRiskTiersResponse>('/api/v1/inventory/data/model_risk_tiers')
	return response.data
}
