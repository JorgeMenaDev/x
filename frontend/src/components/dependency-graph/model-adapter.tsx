'use client'

import { useState } from 'react'
import DependencyGraph from '.'
import { ModelGraph, ModelNode, ModelEdge } from '@/features/model-relationships/types'
import { useModelGraphByRoot } from '@/features/model-relationships/api/get-model-graph'
import { rootModels } from '@/features/model-relationships/api/get-models'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Types required for DependencyGraph
interface ModelGraphData {
	nodes: {
		id: string
		label: string
		data: {
			name: string
			type: string
			risk: 'high' | 'medium' | 'low'
			domain?: string
			team?: string
		}
	}[]
	edges: {
		id: string
		source: string
		target: string
		data: {
			dependencyType: string
		}
	}[]
}

/**
 * Adapter component that transforms model data for the DependencyGraph
 */
export default function ModelDataAdapter() {
	const [selectedModel, setSelectedModel] = useState('MODEL_Z')
	const { data, isLoading } = useModelGraphByRoot(selectedModel)

	const handleModelChange = (value: string) => {
		setSelectedModel(value)
	}

	if (isLoading) {
		return (
			<div className='flex justify-center items-center h-40'>
				<div className='animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full'></div>
				<span className='ml-2'>Loading model data...</span>
			</div>
		)
	}

	if (!data) {
		return <div>No data available</div>
	}

	// Map model types to risk ratings
	const mapRiskTier = (type: number): 'high' | 'medium' | 'low' => {
		switch (type) {
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

	// Transform models data to graph data
	const graphData: ModelGraphData = {
		nodes: (data as ModelGraph).nodes.map((node: ModelNode) => ({
			id: node.id,
			label: node.name,
			data: {
				name: node.name,
				type: 'Model',
				risk: mapRiskTier(node.type),
				domain: node.owner || 'Unknown',
				team: node.accountableExec || 'Unknown'
			}
		})),
		edges: (data as ModelGraph).edges.map((edge: ModelEdge) => ({
			id: `${edge.source}-${edge.target}`,
			source: edge.source,
			target: edge.target,
			data: {
				dependencyType: edge.description || edge.type
			}
		}))
	}

	return (
		<Card>
			<CardHeader className='pb-0'>
				<CardTitle>Model Relationships</CardTitle>
				<div className='w-full max-w-xs mt-2'>
					<Select value={selectedModel} onValueChange={handleModelChange}>
						<SelectTrigger>
							<SelectValue placeholder='Select a model' />
						</SelectTrigger>
						<SelectContent>
							{rootModels.map(model => (
								<SelectItem key={model.id} value={model.id}>
									{model.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</CardHeader>
			<CardContent>
				<div className='w-full h-[500px]'>
					<DependencyGraph customData={graphData} nodeSize={35} />
				</div>
			</CardContent>
		</Card>
	)
}
