// Model relationship types

// Existing model types (based on model_json_example.json)
export interface ValidationComment {
	comment: string
	commentDate: string
	commentBy: string
}

export interface ReviewReport {
	report: string
	reportDate: string
	reportBy: string
	linkToDocument: string
}

export interface ModelUse {
	subgroup: number
	use: number
	assetClass: number
	execUsage: string
	user: string
}

// Model relationship types
export interface ModelRelationship {
	modelId: string
	type: 'input' | 'output'
	description?: string
}

// Complete model type with relationships
export interface Model {
	uniqueReference: string
	modelName: string
	modelType: number
	purpose: number
	owner: string
	accountableExec: string
	riskTier: number
	lastValidationDate: string
	nextValidationDate: string
	validationStatus: number
	validationComments: ValidationComment[]
	leadReviewer: string
	dateOfReview: string
	typeOfReview: number
	reviewReport: ReviewReport[]
	modelUses: ModelUse[]
	// Adding model relationships
	relationships: ModelRelationship[]
}

// Graph representation types
export interface ModelNode {
	id: string
	name: string
	type: number
	purpose: number
	owner: string
	accountableExec: string
}

export interface ModelEdge {
	source: string
	target: string
	type: 'input' | 'output'
	description?: string
}

export interface ModelGraph {
	nodes: ModelNode[]
	edges: ModelEdge[]
}
