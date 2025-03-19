'use client'

import { useEffect, useState } from 'react'
import DependencyGraph from './index'
import { useModelGraph } from '@/features/model-relationships/api/get-model-graph'
import { ModelNode, ModelEdge } from '@/features/model-relationships/types'

// Types from the DependencyGraph component
interface DGModelNode {
	id: string
	name: string
	type: string
	riskRating: 'high' | 'medium' | 'low'
	owner: string
	department: string
	lastUpdated: string
	purpose: string
}

interface DGModelEdge {
	source: string
	target: string
	relationship: 'input' | 'output' | 'calculation'
	description?: string
}

interface DGModelGraphData {
	nodes: DGModelNode[]
	edges: DGModelEdge[]
}

// Define the expected type for our data source
interface GraphData {
	nodes: ModelNode[]
	edges: ModelEdge[]
}

/**
 * ModelDataAdapter transforms model relationship data for the DependencyGraph component
 */
export default function ModelDataAdapter() {
	const [adaptedData, setAdaptedData] = useState<DGModelGraphData | null>(null)
	const { data, isLoading } = useModelGraph() as { data: GraphData | null; isLoading: boolean }

	useEffect(() => {
		if (!data) return

		// Transform nodes to DependencyGraph format
		const transformedNodes: DGModelNode[] = data.nodes.map((node: ModelNode) => ({
			id: node.id,
			name: node.name,
			type: 'Model',
			riskRating: mapRiskTier(node.type), // Map model type to risk rating
			owner: node.owner || 'Unknown',
			department: 'Model Management',
			lastUpdated: new Date().toISOString().split('T')[0],
			purpose: `${node.name} model for financial calculations`
		}))

		// Transform edges to DependencyGraph format
		const transformedEdges: DGModelEdge[] = data.edges.map((edge: ModelEdge) => ({
			source: edge.source,
			target: edge.target,
			relationship: edge.type === 'input' ? 'input' : 'output',
			description: edge.description
		}))

		setAdaptedData({
			nodes: transformedNodes,
			edges: transformedEdges
		})
	}, [data])

	// Map model type to risk rating for visualization
	function mapRiskTier(modelType: number): 'high' | 'medium' | 'low' {
		switch (modelType) {
			case 1:
				return 'low'
			case 2:
				return 'medium'
			case 3:
				return 'high'
			default:
				return 'medium'
		}
	}

	if (isLoading || !adaptedData) {
		return <div className='p-8 text-center'>Loading model dependency data...</div>
	}

	return <DependencyGraph customData={adaptedData} />
}
