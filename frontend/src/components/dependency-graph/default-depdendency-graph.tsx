'use client'

import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Download, Filter, X, ZoomIn, ZoomOut, Move } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import ModelDetailsCard from './model-details-card'

// Types for our model data
interface QmModel {
	qmModelId: number
	qmType: string | null
	qmPurpose: string | null
	qmTypeId: number | null
	qmPurposeId: number | null
	qmName: string
	owner: string | null
	accountableExec: string | null
	modelUses: any[]
	createdAt: string
	updatedAt: string | null
}

interface ModelRelationship {
	id: number | null
	qmModel: QmModel
	qmInputToModel: QmModel | null
	qmModelId: number | null
	qmInputTo: string | null
	createdAt: string
	updatedAt: string | null
	inputToModels: ModelRelationship[]
}

interface ModelResponse {
	success: boolean
	message: string
	data: ModelRelationship[]
}

interface ModelNode {
	id: string
	name: string
	type: string
	riskRating: 'high' | 'medium' | 'low'
	owner: string
	department: string
	lastUpdated: string
	purpose: string
	remediationStatus?: string
	remediationSteps?: string[]
	changeHistory?: {
		date: string
		change: string
		user: string
	}[]
}

interface ModelEdge {
	source: string
	target: string
	relationship: string
	description?: string
}

interface ModelGraphData {
	nodes: ModelNode[]
	edges: ModelEdge[]
}

// Enhanced mock data for demonstration
const mockGraphData: ModelGraphData = {
	nodes: [
		{
			id: 'MDL001',
			name: 'Credit Risk Assessment',
			type: 'Model',
			riskRating: 'high',
			owner: 'Jane Smith',
			department: 'Risk Management',
			lastUpdated: '2023-10-15',
			purpose: 'Evaluate credit risk for loan applications',
			remediationStatus: 'In Progress',
			remediationSteps: [
				'Update model parameters based on latest market data',
				'Conduct additional validation tests',
				'Review documentation for completeness'
			],
			changeHistory: [
				{ date: '2023-10-15', change: 'Updated risk parameters', user: 'Jane Smith' },
				{ date: '2023-08-22', change: 'Annual review completed', user: 'Robert Johnson' },
				{ date: '2023-05-10', change: 'Model validation', user: 'Sarah Williams' }
			]
		},
		{
			id: 'MDL002',
			name: 'Loan Pricing Model',
			type: 'Model',
			riskRating: 'medium',
			owner: 'Robert Johnson',
			department: 'Finance',
			lastUpdated: '2023-09-28',
			purpose: 'Determine appropriate pricing for loan products',
			remediationStatus: 'Completed',
			changeHistory: [
				{ date: '2023-09-28', change: 'Updated pricing algorithm', user: 'Robert Johnson' },
				{ date: '2023-07-15', change: 'Quarterly review', user: 'Robert Johnson' }
			]
		},
		{
			id: 'MDL003',
			name: 'Portfolio Risk Model',
			type: 'Model',
			riskRating: 'high',
			owner: 'Michael Brown',
			department: 'Risk Management',
			lastUpdated: '2023-11-05',
			purpose: 'Assess risk across the entire loan portfolio',
			remediationStatus: 'Not Started',
			remediationSteps: [
				'Conduct sensitivity analysis',
				'Update correlation factors',
				'Review stress testing scenarios'
			]
		},
		{
			id: 'MDL004',
			name: 'Customer Offer Generator',
			type: 'DQM in scope',
			riskRating: 'low',
			owner: 'Lisa Anderson',
			department: 'Marketing',
			lastUpdated: '2023-10-20',
			purpose: 'Generate personalized offers for customers'
		},
		{
			id: 'MDL005',
			name: 'Market Risk Model',
			type: 'Model',
			riskRating: 'high',
			owner: 'David Wilson',
			department: 'Risk Management',
			lastUpdated: '2023-11-10',
			purpose: 'Evaluate market risk exposure'
		},
		{
			id: 'MDL006',
			name: 'Liquidity Risk Model',
			type: 'Model',
			riskRating: 'medium',
			owner: 'Emily Davis',
			department: 'Treasury',
			lastUpdated: '2023-10-05',
			purpose: 'Assess liquidity risk and cash flow projections'
		},
		{
			id: 'MDL007',
			name: 'Stress Testing Model',
			type: 'DQM in scope',
			riskRating: 'high',
			owner: 'James Wilson',
			department: 'Compliance',
			lastUpdated: '2023-11-15',
			purpose: 'Conduct regulatory stress tests'
		}
	],
	edges: [
		{
			source: 'MDL001',
			target: 'MDL002',
			relationship: 'input',
			description: 'Credit risk scores feed into loan pricing calculations'
		},
		{
			source: 'MDL001',
			target: 'MDL003',
			relationship: 'input',
			description: 'Individual credit assessments aggregate into portfolio risk'
		},
		{
			source: 'MDL002',
			target: 'MDL004',
			relationship: 'output',
			description: 'Pricing information used to generate customer offers'
		},
		{
			source: 'MDL003',
			target: 'MDL005',
			relationship: 'input',
			description: 'Portfolio risk factors into market risk assessment'
		},
		{
			source: 'MDL005',
			target: 'MDL006',
			relationship: 'input',
			description: 'Market risk impacts liquidity projections'
		},
		{
			source: 'MDL005',
			target: 'MDL007',
			relationship: 'input',
			description: 'Market risk scenarios used in stress testing'
		},
		{
			source: 'MDL006',
			target: 'MDL007',
			relationship: 'input',
			description: 'Liquidity projections incorporated into stress tests'
		}
	]
}

// Add mock data for different models
const MODEL_1_DATA: ModelGraphData = mockGraphData // Original mock data
const MODEL_2_DATA: ModelGraphData = {
	nodes: [
		{
			id: 'LP001',
			name: 'Loan Pricing Core',
			type: 'Model',
			riskRating: 'high',
			owner: 'Sarah Wilson',
			department: 'Finance',
			lastUpdated: '2024-02-15',
			purpose: 'Core loan pricing calculations',
			remediationStatus: 'In Progress',
			remediationSteps: ['Update pricing parameters', 'Validate market data inputs', 'Review risk adjustments']
		},
		{
			id: 'LP002',
			name: 'Market Data Feed',
			type: 'DQM',
			riskRating: 'medium',
			owner: 'John Davis',
			department: 'Market Data',
			lastUpdated: '2024-02-10',
			purpose: 'Market data integration'
		},
		{
			id: 'LP003',
			name: 'Risk Adjustment',
			type: 'Model',
			riskRating: 'high',
			owner: 'Emily Chen',
			department: 'Risk',
			lastUpdated: '2024-02-12',
			purpose: 'Risk-based pricing adjustments'
		}
	],
	edges: [
		{
			source: 'LP002',
			target: 'LP001',
			relationship: 'input',
			description: 'Market data feed'
		},
		{
			source: 'LP003',
			target: 'LP001',
			relationship: 'input',
			description: 'Risk adjustments'
		}
	]
}

const MODEL_3_DATA: ModelGraphData = {
	nodes: [
		{
			id: 'PR001',
			name: 'Portfolio Risk Engine',
			type: 'Model',
			riskRating: 'high',
			owner: 'Michael Brown',
			department: 'Risk',
			lastUpdated: '2024-02-20',
			purpose: 'Portfolio risk assessment',
			remediationStatus: 'Completed',
			remediationSteps: ['Updated risk metrics', 'Enhanced stress testing', 'Improved reporting']
		},
		{
			id: 'PR002',
			name: 'Market Risk Feed',
			type: 'DQM',
			riskRating: 'medium',
			owner: 'Lisa Anderson',
			department: 'Market Risk',
			lastUpdated: '2024-02-18',
			purpose: 'Market risk data'
		},
		{
			id: 'PR003',
			name: 'Credit Risk Feed',
			type: 'DQM',
			riskRating: 'high',
			owner: 'David Wilson',
			department: 'Credit Risk',
			lastUpdated: '2024-02-19',
			purpose: 'Credit risk data'
		}
	],
	edges: [
		{
			source: 'PR002',
			target: 'PR001',
			relationship: 'input',
			description: 'Market risk data'
		},
		{
			source: 'PR003',
			target: 'PR001',
			relationship: 'input',
			description: 'Credit risk data'
		}
	]
}

const MODEL_4_DATA: ModelGraphData = {
	nodes: [
		{
			id: 'MR001',
			name: 'Market Risk Core',
			type: 'Model',
			riskRating: 'high',
			owner: 'James Wilson',
			department: 'Market Risk',
			lastUpdated: '2024-02-25',
			purpose: 'Market risk assessment',
			remediationStatus: 'Not Started',
			remediationSteps: ['Review VaR calculations', 'Update stress scenarios', 'Enhance risk reporting']
		},
		{
			id: 'MR002',
			name: 'Price Feed',
			type: 'DQM',
			riskRating: 'low',
			owner: 'Emma Davis',
			department: 'Market Data',
			lastUpdated: '2024-02-23',
			purpose: 'Price data integration'
		},
		{
			id: 'MR003',
			name: 'Volatility Model',
			type: 'Model',
			riskRating: 'medium',
			owner: 'Robert Chen',
			department: 'Quant',
			lastUpdated: '2024-02-24',
			purpose: 'Volatility calculations'
		}
	],
	edges: [
		{
			source: 'MR002',
			target: 'MR001',
			relationship: 'input',
			description: 'Price data'
		},
		{
			source: 'MR003',
			target: 'MR001',
			relationship: 'input',
			description: 'Volatility inputs'
		}
	]
}

const MODEL_5_DATA: ModelGraphData = {
	nodes: [
		{
			id: 'MODEL_Z',
			name: 'Model Z',
			type: 'Model',
			riskRating: 'high',
			owner: 'Alex Thompson',
			department: 'Core Models',
			lastUpdated: '2024-02-28',
			purpose: 'Core model orchestration',
			remediationStatus: 'Completed',
			remediationSteps: ['Core model validation', 'Integration testing', 'Documentation update']
		},
		{
			id: 'MODEL_P',
			name: 'Model P',
			type: 'Model',
			riskRating: 'medium',
			owner: 'Sarah Chen',
			department: 'Risk Analytics',
			lastUpdated: '2024-02-26',
			purpose: 'Risk processing module'
		},
		{
			id: 'MODEL_Q',
			name: 'Model Q',
			type: 'Model',
			riskRating: 'medium',
			owner: 'Michael Lee',
			department: 'Analytics',
			lastUpdated: '2024-02-25',
			purpose: 'Analytics processing'
		},
		{
			id: 'MODEL_S',
			name: 'Model S',
			type: 'Model',
			riskRating: 'low',
			owner: 'Emma Davis',
			department: 'Risk Analytics',
			lastUpdated: '2024-02-24',
			purpose: 'Specialized risk calculations'
		},
		{
			id: 'MODEL_R',
			name: 'Model R',
			type: 'Model',
			riskRating: 'low',
			owner: 'James Wilson',
			department: 'Analytics',
			lastUpdated: '2024-02-23',
			purpose: 'Results processing'
		}
	],
	edges: [
		{
			source: 'MODEL_Z',
			target: 'MODEL_P',
			relationship: 'output',
			description: 'Core to Risk Processing'
		},
		{
			source: 'MODEL_Z',
			target: 'MODEL_Q',
			relationship: 'output',
			description: 'Core to Analytics Processing'
		},
		{
			source: 'MODEL_P',
			target: 'MODEL_S',
			relationship: 'output',
			description: 'Risk Processing to Specialized Calculations'
		},
		{
			source: 'MODEL_Q',
			target: 'MODEL_R',
			relationship: 'output',
			description: 'Analytics Processing to Results'
		}
	]
}

// Function to transform the API response into graph data
const transformModelData = (modelResponse: ModelResponse | null): ModelGraphData => {
	const nodes: ModelNode[] = []
	const edges: ModelEdge[] = []
	const processedNodes = new Set<number>()

	// Return empty graph data if response is null or data is missing
	if (!modelResponse || !modelResponse.data || !Array.isArray(modelResponse.data)) {
		return { nodes: [], edges: [] }
	}

	const processRelationship = (relationship: ModelRelationship, parentId?: string) => {
		// Skip if relationship or qmModel is missing
		if (!relationship || !relationship.qmModel) return

		// Add source model node if not already added
		if (!processedNodes.has(relationship.qmModel.qmModelId)) {
			nodes.push({
				id: relationship.qmModel.qmModelId.toString(),
				name: relationship.qmModel.qmName,
				type: relationship.qmModel.qmType || 'Model',
				riskRating: 'medium', // Default risk rating - can be adjusted based on business logic
				owner: relationship.qmModel.owner || 'Unknown',
				department: relationship.qmModel.accountableExec || 'Unknown',
				lastUpdated: relationship.qmModel.updatedAt || relationship.qmModel.createdAt,
				purpose: relationship.qmModel.qmPurpose || 'Not specified'
			})
			processedNodes.add(relationship.qmModel.qmModelId)
		}

		// If there's a parent, add the edge
		if (parentId) {
			edges.push({
				source: parentId,
				target: relationship.qmModel.qmModelId.toString(),
				relationship: 'input',
				description: 'Model input relationship'
			})
		}

		// Process input models recursively
		if (relationship.inputToModels && Array.isArray(relationship.inputToModels)) {
			relationship.inputToModels.forEach(inputModel => {
				if (inputModel && inputModel.qmModel) {
					// Add the input model node if not already added
					if (!processedNodes.has(inputModel.qmModel.qmModelId)) {
						nodes.push({
							id: inputModel.qmModel.qmModelId.toString(),
							name: inputModel.qmModel.qmName,
							type: inputModel.qmModel.qmType || 'Model',
							riskRating: 'medium',
							owner: inputModel.qmModel.owner || 'Unknown',
							department: inputModel.qmModel.accountableExec || 'Unknown',
							lastUpdated: inputModel.qmModel.updatedAt || inputModel.qmModel.createdAt,
							purpose: inputModel.qmModel.qmPurpose || 'Not specified'
						})
						processedNodes.add(inputModel.qmModel.qmModelId)
					}

					// Add edge from current model to input model
					edges.push({
						source: relationship.qmModel.qmModelId.toString(),
						target: inputModel.qmModel.qmModelId.toString(),
						relationship: 'input',
						description: 'Model input relationship'
					})

					// Process nested relationships
					processRelationship(inputModel, inputModel.qmModel.qmModelId.toString())
				}
			})
		}
	}

	// Process each relationship in the response
	modelResponse.data.forEach(relationship => {
		if (relationship) {
			processRelationship(relationship)
		}
	})

	return { nodes, edges }
}

// Update the MODEL_DATA_MAP to use the new data structure
const MODEL_DATA_MAP: { [key: string]: ModelGraphData } = {
	// Example of how to use the transform function with actual data
	// MODEL_1: transformModelData(MODEL_1_RESPONSE),
	// Keep the mock data for now
	MODEL_1: MODEL_1_DATA,
	MODEL_2: MODEL_2_DATA,
	MODEL_3: MODEL_3_DATA,
	MODEL_4: MODEL_4_DATA,
	MODEL_5: MODEL_5_DATA
}

// Add root models for dropdown selection
const rootModels = [
	{ id: 'MODEL_1', name: 'Credit Risk Assessment Model', data: MODEL_1_DATA },
	{ id: 'MODEL_2', name: 'Loan Pricing Model', data: MODEL_2_DATA },
	{ id: 'MODEL_3', name: 'Portfolio Risk Model', data: MODEL_3_DATA },
	{ id: 'MODEL_4', name: 'Market Risk Model', data: MODEL_4_DATA },
	{ id: 'MODEL_5', name: 'Model Z Hierarchy', data: MODEL_5_DATA }
]

// Available models for selection
const availableModels = [
	{
		id: '99009',
		name: 'Complex Regulatory Market Data Publications'
	},
	{
		id: '99008',
		name: 'Simple Market Data Publication'
	},
	{
		id: '99010',
		name: 'Deterministic.RFR.FX'
	},
	{
		id: '171',
		name: 'Credit Curves'
	}
]

export default function DefaultDependencyGraph() {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const [selectedNode, setSelectedNode] = useState<ModelNode | null>(null)
	const [hoveredNode, setHoveredNode] = useState<ModelNode | null>(null)
	const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
	const [filters, setFilters] = useState({
		riskLevels: { high: true, medium: true, low: true },
		departments: new Set<string>(),
		owners: new Set<string>()
	})
	const [showFilters, setShowFilters] = useState(false)
	const [isSimulationStable, setIsSimulationStable] = useState(false)
	const nodePositionsRef = useRef<{ [key: string]: { x: number; y: number; vx: number; vy: number } }>({})
	const animationRef = useRef<number | null>(null)
	const [selectedModelId, setSelectedModelId] = useState(availableModels[0].id)
	const [scale, setScale] = useState(1)
	const [offset, setOffset] = useState({ x: 0, y: 0 })
	const [isDragging, setIsDragging] = useState(false)
	const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
	const [draggedNode, setDraggedNode] = useState<string | null>(null)
	const [groupBy, setGroupBy] = useState<'none' | 'department' | 'risk'>('none')
	const [groups, setGroups] = useState<{ [key: string]: boolean }>({})
	const [isDraggingNode, setIsDraggingNode] = useState(false)
	const dragStartTimeRef = useRef<number>(0)
	const [modelResponse, setModelResponse] = useState<ModelResponse | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	// Transform current model data based on selection
	const currentModelData = useMemo(() => {
		if (modelResponse) {
			return transformModelData(modelResponse)
		}
		// Return empty graph data structure if no data available
		return {
			nodes: [],
			edges: []
		}
	}, [selectedModelId, modelResponse])

	// Get unique departments and owners for filters
	const departments = useMemo(() => {
		return Array.from(new Set(currentModelData?.nodes?.map(node => node.department) || []))
	}, [currentModelData])

	const owners = useMemo(() => {
		return Array.from(new Set(currentModelData?.nodes?.map(node => node.owner) || []))
	}, [currentModelData])

	// Function to fetch model relationships
	const fetchModelRelationships = async (modelId: string) => {
		try {
			setIsLoading(true)
			const response = await fetch(`/api/model-relationships/${modelId}`)
			const data = await response.json()
			setModelResponse(data)
		} catch (error) {
			console.error('Error fetching model relationships:', error)
			setModelResponse(null)
		} finally {
			setIsLoading(false)
		}
	}

	// Effect to fetch data when model changes
	useEffect(() => {
		fetchModelRelationships(selectedModelId)
	}, [selectedModelId])

	// Update filters when model changes
	useEffect(() => {
		if (currentModelData && currentModelData.nodes) {
			setFilters(prev => ({
				...prev,
				departments: new Set(departments),
				owners: new Set(owners)
			}))
			setSelectedNode(null)
			setIsSimulationStable(false)
		}
	}, [departments, owners])

	// Filter nodes based on current filters
	const filteredNodes = useMemo(() => {
		if (!currentModelData?.nodes) return []

		return currentModelData.nodes.filter(
			node =>
				filters.riskLevels[node.riskRating as keyof typeof filters.riskLevels] &&
				filters.departments.has(node.department) &&
				filters.owners.has(node.owner)
		)
	}, [currentModelData, filters])

	// Get filtered node IDs for edge filtering
	const filteredNodeIds = useMemo(() => {
		return new Set(filteredNodes.map(node => node.id))
	}, [filteredNodes])

	// Filter edges to only include connections between visible nodes
	const filteredEdges = useMemo(() => {
		if (!currentModelData?.edges) return []

		return currentModelData.edges.filter(edge => filteredNodeIds.has(edge.source) && filteredNodeIds.has(edge.target))
	}, [currentModelData, filteredNodeIds])

	// Get direct connections for selected node
	const getNodeConnections = (nodeId: string) => {
		const upstream = mockGraphData.edges
			.filter(edge => edge.target === nodeId)
			.map(edge => {
				const sourceNode = mockGraphData.nodes.find(node => node.id === edge.source)
				return {
					node: sourceNode,
					relationship: edge.relationship,
					description: edge.description,
					direction: 'upstream'
				}
			})

		const downstream = mockGraphData.edges
			.filter(edge => edge.source === nodeId)
			.map(edge => {
				const targetNode = mockGraphData.nodes.find(node => node.id === edge.target)
				return {
					node: targetNode,
					relationship: edge.relationship,
					description: edge.description,
					direction: 'downstream'
				}
			})

		return { upstream, downstream }
	}

	// Export graph data as JSON
	const exportData = (format: 'json' | 'csv') => {
		let data
		let filename
		let type

		if (format === 'json') {
			data = JSON.stringify(
				{
					nodes: filteredNodes,
					edges: filteredEdges
				},
				null,
				2
			)
			filename = 'model-dependencies.json'
			type = 'application/json'
		} else {
			// Create CSV for nodes
			const nodeHeaders = 'id,name,type,riskRating,owner,department,lastUpdated,purpose\n'
			const nodeRows = filteredNodes
				.map(
					node =>
						`${node.id},${node.name},${node.type},${node.riskRating},${node.owner},${node.department},${node.lastUpdated},${node.purpose}`
				)
				.join('\n')

			// Create CSV for edges
			const edgeHeaders = 'source,target,relationship,description\n'
			const edgeRows = filteredEdges
				.map(edge => `${edge.source},${edge.target},${edge.relationship},${edge.description || ''}`)
				.join('\n')

			data = `# NODES\n${nodeHeaders}${nodeRows}\n\n# EDGES\n${edgeHeaders}${edgeRows}`
			filename = 'model-dependencies.csv'
			type = 'text/csv'
		}

		const blob = new Blob([data], { type })
		const url = URL.createObjectURL(blob)

		const link = document.createElement('a')
		link.href = url
		link.download = filename
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
	}

	// Colors based on risk rating
	const getRiskColor = (rating: string) => {
		switch (rating) {
			case 'high':
				return '#ef4444'
			case 'medium':
				return '#f97316'
			case 'low':
				return '#22c55e'
			default:
				return '#3b82f6'
		}
	}

	// Separate the physics simulation from the rendering
	const runPhysicsSimulation = useCallback(() => {
		if (isSimulationStable) return

		const nodePositions = nodePositionsRef.current

		// Apply forces
		for (let i = 0; i < 10; i++) {
			// Multiple iterations for stability
			// Repulsive force between all nodes
			filteredNodes.forEach(node1 => {
				filteredNodes.forEach(node2 => {
					if (node1.id === node2.id) return

					const pos1 = nodePositions[node1.id]
					const pos2 = nodePositions[node2.id]
					if (!pos1 || !pos2) return

					const dx = pos2.x - pos1.x
					const dy = pos2.y - pos1.y
					const distance = Math.sqrt(dx * dx + dy * dy)

					if (distance === 0) return

					// Repulsive force (inverse square)
					const force = 1000 / (distance * distance)
					const fx = (dx / distance) * force
					const fy = (dy / distance) * force

					pos1.vx -= fx
					pos1.vy -= fy
					pos2.vx += fx
					pos2.vy += fy
				})
			})

			// Attractive force along edges
			filteredEdges.forEach(edge => {
				const pos1 = nodePositions[edge.source]
				const pos2 = nodePositions[edge.target]
				if (!pos1 || !pos2) return

				const dx = pos2.x - pos1.x
				const dy = pos2.y - pos1.y
				const distance = Math.sqrt(dx * dx + dy * dy)

				if (distance === 0) return

				// Spring force
				const force = (distance - 100) * 0.01
				const fx = (dx / distance) * force
				const fy = (dy / distance) * force

				pos1.vx += fx
				pos1.vy += fy
				pos2.vx -= fx
				pos2.vy -= fy
			})
		}

		// Update positions with velocity and damping
		let totalMovement = 0

		filteredNodes.forEach(node => {
			const pos = nodePositions[node.id]
			if (!pos) return

			// Apply velocity with damping
			const dx = pos.vx * 0.1
			const dy = pos.vy * 0.1

			pos.x += dx
			pos.y += dy
			pos.vx *= 0.9
			pos.vy *= 0.9

			// Contain within canvas
			if (pos.x < 50) pos.x = 50
			if (pos.x > 1000) pos.x = 1000
			if (pos.y < 50) pos.y = 50
			if (pos.y > 450) pos.y = 450

			// Calculate total movement to determine stability
			totalMovement += Math.abs(dx) + Math.abs(dy)
		})

		// If total movement is very small, consider the simulation stable
		if (totalMovement < 0.5) {
			setIsSimulationStable(true)
		}
	}, [filteredNodes, filteredEdges, isSimulationStable])

	// Function to calculate group positions
	const calculateGroupPositions = useCallback(() => {
		if (groupBy === 'none') return {}

		const groupPositions: { [key: string]: { x: number; y: number; width: number; height: number } } = {}
		const groupedNodes: { [key: string]: ModelNode[] } = {}

		// Group nodes
		filteredNodes.forEach(node => {
			const groupKey = groupBy === 'department' ? node.department : node.riskRating
			if (!groupedNodes[groupKey]) {
				groupedNodes[groupKey] = []
			}
			groupedNodes[groupKey].push(node)
		})

		// Calculate group positions
		const canvasWidth = canvasRef.current?.width || 1000
		const canvasHeight = canvasRef.current?.height || 500
		const padding = 50
		const groupCount = Object.keys(groupedNodes).length
		const groupHeight = (canvasHeight - padding * 2) / groupCount

		// Position groups vertically
		Object.entries(groupedNodes).forEach(([groupKey, nodes], index) => {
			const width = canvasWidth - padding * 2
			const height = groupHeight - padding

			groupPositions[groupKey] = {
				x: padding,
				y: padding + index * groupHeight,
				width,
				height
			}

			// Position nodes within group
			const nodeCount = nodes.length
			const nodesPerRow = Math.ceil(Math.sqrt(nodeCount))
			const nodeSpacing = Math.min(width / nodesPerRow, height / Math.ceil(nodeCount / nodesPerRow))

			nodes.forEach((node, nodeIndex) => {
				const row = Math.floor(nodeIndex / nodesPerRow)
				const col = nodeIndex % nodesPerRow
				const nodeX = padding + col * nodeSpacing + nodeSpacing / 2 + (width - nodesPerRow * nodeSpacing) / 2
				const nodeY = padding + index * groupHeight + row * nodeSpacing + nodeSpacing / 2

				nodePositionsRef.current[node.id] = {
					x: nodeX,
					y: nodeY,
					vx: 0,
					vy: 0
				}
			})
		})

		return groupPositions
	}, [groupBy, filteredNodes])

	// Update effect to handle grouping changes
	useEffect(() => {
		if (groupBy !== 'none') {
			setIsSimulationStable(true) // Stop physics simulation when grouping
			calculateGroupPositions() // Position nodes in groups
		} else {
			setIsSimulationStable(false) // Resume physics simulation when no grouping
		}
	}, [groupBy, calculateGroupPositions])

	// Update renderGraph function
	const renderGraph = useCallback(() => {
		const canvas = canvasRef.current
		if (!canvas) return

		const ctx = canvas.getContext('2d')
		if (!ctx) return

		ctx.save()
		ctx.clearRect(0, 0, canvas.width, canvas.height)

		// Apply zoom and pan
		ctx.translate(offset.x, offset.y)
		ctx.scale(scale, scale)

		// Draw groups if enabled
		if (groupBy !== 'none') {
			const groupPositions = calculateGroupPositions()
			Object.entries(groupPositions).forEach(([groupKey, pos]) => {
				if (groups[groupKey] !== false) {
					// Draw if group is not collapsed
					ctx.fillStyle = 'rgba(55, 65, 81, 0.3)'
					ctx.strokeStyle = '#4b5563'
					ctx.lineWidth = 1
					ctx.beginPath()
					ctx.roundRect(pos.x, pos.y, pos.width, pos.height, 10)
					ctx.fill()
					ctx.stroke()

					// Group label
					ctx.fillStyle = '#e5e7eb'
					ctx.font = 'bold 14px Arial'
					ctx.fillText(groupKey, pos.x + 10, pos.y + 25)
				}
			})
		}

		// Draw edges
		ctx.lineWidth = 1
		filteredEdges.forEach(edge => {
			const pos1 = nodePositionsRef.current[edge.source]
			const pos2 = nodePositionsRef.current[edge.target]
			if (!pos1 || !pos2) return

			// Highlight edges connected to selected node
			const isSelected = selectedNode && (selectedNode.id === edge.source || selectedNode.id === edge.target)

			ctx.beginPath()
			ctx.moveTo(pos1.x, pos1.y)
			ctx.lineTo(pos2.x, pos2.y)

			// Edge styling based on selection state
			if (isSelected) {
				// Highlighted edge style - similar to org chart
				ctx.strokeStyle = '#60a5fa' // Bright blue for selected connections
				ctx.lineWidth = 3
			} else {
				// Normal edge style - more subtle
				ctx.strokeStyle = '#4b5563' // Subtle gray for unselected
				ctx.lineWidth = 1
				ctx.globalAlpha = 0.5
			}

			ctx.stroke()
			ctx.globalAlpha = 1.0

			// Draw arrow
			const angle = Math.atan2(pos2.y - pos1.y, pos2.x - pos1.x)
			const arrowSize = isSelected ? 12 : 8

			ctx.beginPath()
			ctx.moveTo(pos2.x - arrowSize * Math.cos(angle - Math.PI / 6), pos2.y - arrowSize * Math.sin(angle - Math.PI / 6))
			ctx.lineTo(pos2.x, pos2.y)
			ctx.lineTo(pos2.x - arrowSize * Math.cos(angle + Math.PI / 6), pos2.y - arrowSize * Math.sin(angle + Math.PI / 6))
			ctx.fillStyle = isSelected ? '#60a5fa' : '#4b5563'
			ctx.fill()
		})

		// Draw nodes
		filteredNodes.forEach(node => {
			const pos = nodePositionsRef.current[node.id]
			if (!pos) return

			const isSelected = selectedNode && selectedNode.id === node.id
			const isHovered = hoveredNode && hoveredNode.id === node.id
			const isConnected =
				selectedNode &&
				filteredEdges.some(
					edge =>
						(edge.source === selectedNode.id && edge.target === node.id) ||
						(edge.target === selectedNode.id && edge.source === node.id)
				)

			// Node circle
			ctx.beginPath()
			ctx.arc(pos.x, pos.y, isSelected || isHovered ? 22 : 20, 0, Math.PI * 2)

			// Fill color based on state
			if (isSelected) {
				ctx.fillStyle = '#60a5fa' // Bright blue for selected node
			} else if (isConnected) {
				ctx.fillStyle = getRiskColor(node.riskRating)
				ctx.globalAlpha = 1.0 // Full opacity for connected nodes
			} else if (selectedNode) {
				ctx.fillStyle = getRiskColor(node.riskRating)
				ctx.globalAlpha = 0.3 // Fade out unconnected nodes when a node is selected
			} else {
				ctx.fillStyle = getRiskColor(node.riskRating)
				ctx.globalAlpha = 1.0
			}

			ctx.fill()
			ctx.globalAlpha = 1.0

			// Node border
			ctx.strokeStyle = isSelected ? '#1d4ed8' : isConnected ? '#ffffff' : '#e5e7eb'
			ctx.lineWidth = isSelected || isHovered ? 3 : 2
			ctx.stroke()

			// Node label
			ctx.fillStyle = isSelected || isConnected ? '#ffffff' : '#e5e7eb'
			ctx.font = isSelected || isHovered ? 'bold 10px Arial' : '10px Arial'
			ctx.textAlign = 'center'
			ctx.textBaseline = 'middle'
			ctx.fillText(node.id, pos.x, pos.y)
		})

		// Draw tooltip for hovered node
		if (hoveredNode) {
			const pos = nodePositionsRef.current[hoveredNode.id]
			if (pos) {
				const tooltipWidth = 200
				const tooltipHeight = 80
				const padding = 10

				// Position tooltip to avoid going off-screen
				let tooltipX = mousePos.x + 15
				let tooltipY = mousePos.y + 15

				if (tooltipX + tooltipWidth > canvas.width) {
					tooltipX = mousePos.x - tooltipWidth - 15
				}

				if (tooltipY + tooltipHeight > canvas.height) {
					tooltipY = mousePos.y - tooltipHeight - 15
				}

				// Draw tooltip background
				ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
				ctx.strokeStyle = '#ffffff'
				ctx.lineWidth = 1
				ctx.beginPath()
				ctx.roundRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight, 5)
				ctx.fill()
				ctx.stroke()

				// Draw tooltip content
				ctx.fillStyle = '#ffffff'
				ctx.font = 'bold 12px Arial'
				ctx.textAlign = 'left'
				ctx.textBaseline = 'top'
				ctx.fillText(hoveredNode.name, tooltipX + padding, tooltipY + padding)

				ctx.font = '10px Arial'
				ctx.fillText(`ID: ${hoveredNode.id}`, tooltipX + padding, tooltipY + padding + 20)
				ctx.fillText(`Risk: ${hoveredNode.riskRating.toUpperCase()}`, tooltipX + padding, tooltipY + padding + 35)
				ctx.fillText(`Owner: ${hoveredNode.owner}`, tooltipX + padding, tooltipY + padding + 50)
			}
		}

		// Continue animation
		if (!isSimulationStable) {
			runPhysicsSimulation()
		}

		ctx.restore()

		animationRef.current = requestAnimationFrame(renderGraph)
	}, [filteredNodes, filteredEdges, selectedNode, hoveredNode, mousePos, scale, offset, groupBy, groups])

	// Initialize canvas and simulation
	useEffect(() => {
		if (!canvasRef.current) return

		const canvas = canvasRef.current

		// Set canvas size
		const resizeCanvas = () => {
			const rect = canvas.getBoundingClientRect()
			canvas.width = rect.width
			canvas.height = 500 // Fixed height
		}

		resizeCanvas()
		window.addEventListener('resize', resizeCanvas)

		// Reset simulation when filters change
		setIsSimulationStable(false)

		// Initialize node positions
		const nodePositions = nodePositionsRef.current

		// Keep existing positions for nodes that are still visible
		filteredNodes.forEach(node => {
			if (!nodePositions[node.id]) {
				nodePositions[node.id] = {
					x: Math.random() * canvas.width * 0.8 + canvas.width * 0.1,
					y: Math.random() * canvas.height * 0.8 + canvas.height * 0.1,
					vx: 0,
					vy: 0
				}
			}
		})

		// Start animation
		if (animationRef.current) {
			cancelAnimationFrame(animationRef.current)
		}

		animationRef.current = requestAnimationFrame(renderGraph)

		return () => {
			window.removeEventListener('resize', resizeCanvas)
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current)
			}
		}
	}, [filteredNodes, filteredEdges, renderGraph])

	// Handle mouse interactions
	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return

		const handleMouseDown = (e: MouseEvent) => {
			const rect = canvas.getBoundingClientRect()
			const x = (e.clientX - rect.left - offset.x) / scale
			const y = (e.clientY - rect.top - offset.y) / scale

			// Check if clicking on a node
			let clickedNode = null
			for (const node of filteredNodes) {
				const pos = nodePositionsRef.current[node.id]
				if (!pos) continue

				const dx = x - pos.x
				const dy = y - pos.y
				const distance = Math.sqrt(dx * dx + dy * dy)

				if (distance < 20) {
					clickedNode = node.id
					break
				}
			}

			if (clickedNode) {
				setDraggedNode(clickedNode)
				setIsDraggingNode(false)
				dragStartTimeRef.current = Date.now()
			} else {
				setIsDragging(true)
				setDragStart({ x: e.clientX, y: e.clientY })
			}
		}

		const handleMouseMove = (e: MouseEvent) => {
			const rect = canvas.getBoundingClientRect()
			const x = e.clientX - rect.left
			const y = e.clientY - rect.top
			setMousePos({ x, y })

			if (draggedNode) {
				setIsDraggingNode(true)
				const nodeX = (e.clientX - rect.left - offset.x) / scale
				const nodeY = (e.clientY - rect.top - offset.y) / scale

				nodePositionsRef.current[draggedNode] = {
					...nodePositionsRef.current[draggedNode],
					x: nodeX,
					y: nodeY,
					vx: 0,
					vy: 0
				}
			} else if (isDragging) {
				setOffset(prev => ({
					x: prev.x + (e.clientX - dragStart.x),
					y: prev.y + (e.clientY - dragStart.y)
				}))
				setDragStart({ x: e.clientX, y: e.clientY })
			} else {
				// Handle hover state
				let hovered = null
				for (const node of filteredNodes) {
					const pos = nodePositionsRef.current[node.id]
					if (!pos) continue

					const dx = (x - offset.x) / scale - pos.x
					const dy = (y - offset.y) / scale - pos.y
					const distance = Math.sqrt(dx * dx + dy * dy)

					if (distance < 20) {
						hovered = node
						break
					}
				}

				setHoveredNode(hovered)
				canvas.style.cursor = hovered ? 'pointer' : 'default'
			}
		}

		const handleMouseUp = (e: MouseEvent) => {
			if (draggedNode) {
				const dragDuration = Date.now() - dragStartTimeRef.current
				const wasActuallyDragging = isDraggingNode

				// Reset dragging states
				setDraggedNode(null)
				setIsDraggingNode(false)

				// If it was a quick click (not a drag), select the node
				if (!wasActuallyDragging && dragDuration < 200) {
					const node = filteredNodes.find(n => n.id === draggedNode)
					if (node) {
						setSelectedNode(node)
					}
				}
			}

			setIsDragging(false)
		}

		canvas.addEventListener('mousedown', handleMouseDown)
		window.addEventListener('mousemove', handleMouseMove)
		window.addEventListener('mouseup', handleMouseUp)

		return () => {
			canvas.removeEventListener('mousedown', handleMouseDown)
			window.removeEventListener('mousemove', handleMouseMove)
			window.removeEventListener('mouseup', handleMouseUp)
		}
	}, [scale, offset, draggedNode, isDragging, dragStart, filteredNodes, isDraggingNode])

	// Add zoom controls
	const handleZoom = (direction: 'in' | 'out') => {
		setScale(prevScale => {
			const newScale = direction === 'in' ? prevScale * 1.2 : prevScale / 1.2
			return Math.min(Math.max(0.5, newScale), 2) // Limit zoom between 0.5x and 2x
		})
	}

	if (isLoading) {
		return (
			<div className='flex justify-center items-center h-96'>
				<div className='animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full'></div>
				<span className='ml-3'>Loading model relationships...</span>
			</div>
		)
	}

	if (!currentModelData.nodes.length) {
		return (
			<div className='flex justify-center items-center h-96'>
				<div className='text-center'>
					<h3 className='text-lg font-semibold'>No data available</h3>
					<p className='text-gray-500'>Select a different model or try again later.</p>
				</div>
			</div>
		)
	}

	return (
		<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
			<div className={`${selectedNode ? 'md:col-span-2' : 'md:col-span-3'}`}>
				<Card className='w-full'>
					<CardHeader className='flex flex-row items-center justify-between pb-2'>
						<div>
							<CardTitle>Model Dependency Graph</CardTitle>
							<CardDescription>Interactive visualization of model relationships and dependencies</CardDescription>
						</div>
						<div className='flex items-center gap-2 '>
							<div className=''>
								<Select value={selectedModelId} onValueChange={value => setSelectedModelId(value)}>
									<SelectTrigger className='w-[250px]'>
										{availableModels.find(model => model.id === selectedModelId)?.name || 'Select Model'}
									</SelectTrigger>
									<SelectContent>
										{availableModels.map(model => (
											<SelectItem key={model.id} value={model.id}>
												{model.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<div className='flex items-center gap-1 border rounded-md p-1'>
								<Button variant='ghost' size='sm' onClick={() => handleZoom('in')}>
									<ZoomIn className='h-4 w-4' />
								</Button>
								<Button variant='ghost' size='sm' onClick={() => handleZoom('out')}>
									<ZoomOut className='h-4 w-4' />
								</Button>
								<Button
									variant='ghost'
									size='sm'
									onClick={() => {
										setScale(1)
										setOffset({ x: 0, y: 0 })
									}}
								>
									<Move className='h-4 w-4' />
								</Button>
							</div>
							<Select value={groupBy} onValueChange={value => setGroupBy(value as 'none' | 'department' | 'risk')}>
								<SelectTrigger className='w-[150px]'>
									<span>Group By</span>
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='none'>No Grouping</SelectItem>
									<SelectItem value='department'>Department</SelectItem>
									<SelectItem value='risk'>Risk Level</SelectItem>
								</SelectContent>
							</Select>
							<Button variant='outline' size='sm' onClick={() => setShowFilters(!showFilters)}>
								<Filter className='h-4 w-4 mr-2' />
								Filters
							</Button>
							<Select onValueChange={value => exportData(value as 'json' | 'csv')}>
								<SelectTrigger className='w-[140px]'>
									<Download className='h-4 w-4 mr-2' />
									<span>Export</span>
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='json'>Export as JSON</SelectItem>
									<SelectItem value='csv'>Export as CSV</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</CardHeader>

					{showFilters && (
						<div className='px-6 py-2 border-b'>
							<div className='flex justify-between items-center mb-2'>
								<h3 className='font-medium'>Filter Graph</h3>
								<Button variant='ghost' size='sm' onClick={() => setShowFilters(false)}>
									<X className='h-4 w-4' />
								</Button>
							</div>

							<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
								<div>
									<h4 className='text-sm font-medium mb-2'>Risk Level</h4>
									<div className='space-y-2'>
										<div className='flex items-center space-x-2'>
											<Checkbox
												id='filter-high'
												checked={filters.riskLevels.high}
												onCheckedChange={checked =>
													setFilters({
														...filters,
														riskLevels: { ...filters.riskLevels, high: !!checked }
													})
												}
											/>
											<Label htmlFor='filter-high' className='flex items-center dark:text-white text-dark'>
												<div className='w-3 h-3 rounded-full bg-red-500 mr-2'></div>
												<span className=''>High Risk</span>
											</Label>
										</div>
										<div className='flex items-center space-x-2'>
											<Checkbox
												id='filter-medium'
												checked={filters.riskLevels.medium}
												onCheckedChange={checked =>
													setFilters({
														...filters,
														riskLevels: { ...filters.riskLevels, medium: !!checked }
													})
												}
											/>
											<Label htmlFor='filter-medium' className='flex items-center'>
												<div className='w-3 h-3 rounded-full bg-orange-500 mr-2'></div>
												Medium Risk
											</Label>
										</div>
										<div className='flex items-center space-x-2'>
											<Checkbox
												id='filter-low'
												checked={filters.riskLevels.low}
												onCheckedChange={checked =>
													setFilters({
														...filters,
														riskLevels: { ...filters.riskLevels, low: !!checked }
													})
												}
											/>
											<Label htmlFor='filter-low' className='flex items-center'>
												<div className='w-3 h-3 rounded-full bg-green-500 mr-2'></div>
												Low Risk
											</Label>
										</div>
									</div>
								</div>

								<div>
									<h4 className='text-sm font-medium mb-2'>Department</h4>
									<div className='space-y-2 max-h-32 overflow-y-auto'>
										{departments.map(dept => (
											<div key={dept} className='flex items-center space-x-2'>
												<Checkbox
													id={`filter-dept-${dept}`}
													checked={filters.departments.has(dept)}
													onCheckedChange={checked => {
														const newDepts = new Set(filters.departments)
														if (checked) {
															newDepts.add(dept)
														} else {
															newDepts.delete(dept)
														}
														setFilters({ ...filters, departments: newDepts })
													}}
												/>
												<Label htmlFor={`filter-dept-${dept}`}>{dept}</Label>
											</div>
										))}
									</div>
								</div>

								<div>
									<h4 className='text-sm font-medium mb-2'>Owner</h4>
									<div className='space-y-2 max-h-32 overflow-y-auto'>
										{owners.map(owner => (
											<div key={owner} className='flex items-center space-x-2'>
												<Checkbox
													id={`filter-owner-${owner}`}
													checked={filters.owners.has(owner)}
													onCheckedChange={checked => {
														const newOwners = new Set(filters.owners)
														if (checked) {
															newOwners.add(owner)
														} else {
															newOwners.delete(owner)
														}
														setFilters({ ...filters, owners: newOwners })
													}}
												/>
												<Label htmlFor={`filter-owner-${owner}`}>{owner}</Label>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					)}

					<CardContent>
						<div className='mb-4 flex gap-4'>
							<div className='flex items-center gap-2'>
								<div className='w-3 h-3 rounded-full bg-red-500'></div>
								<span className='text-sm text-dark dark:text-white'>High Risk</span>
							</div>
							<div className='flex items-center gap-2'>
								<div className='w-3 h-3 rounded-full bg-orange-500'></div>
								<span className='text-sm text-dark dark:text-white'>Medium Risk</span>
							</div>
							<div className='flex items-center gap-2'>
								<div className='w-3 h-3 rounded-full bg-green-500'></div>
								<span className='text-sm text-dark dark:text-white'>Low Risk</span>
							</div>
						</div>
						<canvas
							ref={canvasRef}
							className='w-full border rounded-md cursor-grab active:cursor-grabbing'
							style={{ height: '500px' }}
						/>
						<div className='mt-4 text-sm text-muted-foreground'>
							<p>
								Click and drag nodes to reposition them. Use mouse wheel or zoom controls to zoom in/out. Click and drag
								the background to pan.
							</p>
						</div>
					</CardContent>
				</Card>
			</div>

			{selectedNode && (
				<div className='md:col-span-1'>
					<Card className='w-full'>
						<CardHeader className='pb-2'>
							<div className='flex justify-between items-start'>
								<div>
									<CardTitle>{selectedNode.name}</CardTitle>
									<CardDescription>ID: {selectedNode.id}</CardDescription>
								</div>
								<Button variant='ghost' size='sm' onClick={() => setSelectedNode(null)}>
									<X className='h-4 w-4' />
								</Button>
							</div>
						</CardHeader>
						<CardContent className='p-0'>
							<Tabs defaultValue='details' className='w-full'>
								<TabsList className='w-full grid grid-cols-4'>
									<TabsTrigger value='details'>Details</TabsTrigger>
									<TabsTrigger value='dependencies'>Dependencies</TabsTrigger>
									<TabsTrigger value='history'>History</TabsTrigger>
									<TabsTrigger value='model-info'>Model Info</TabsTrigger>
								</TabsList>

								<TabsContent value='details' className='p-4 space-y-4'>
									<div className='grid grid-cols-2 gap-4'>
										<div>
											<h3 className='text-sm font-medium text-muted-foreground'>Type</h3>
											<p>{selectedNode.type}</p>
										</div>
										<div>
											<h3 className='text-sm font-medium text-muted-foreground'>Risk Rating</h3>
											<Badge
												className='text-white'
												variant={
													selectedNode.riskRating === 'high'
														? 'destructive'
														: selectedNode.riskRating === 'medium'
														? 'default'
														: 'secondary'
												}
											>
												{selectedNode.riskRating.toUpperCase()}
											</Badge>
										</div>
										<div>
											<h3 className='text-sm font-medium text-muted-foreground'>Owner</h3>
											<p>{selectedNode.owner}</p>
										</div>
										<div>
											<h3 className='text-sm font-medium text-muted-foreground'>Department</h3>
											<p>{selectedNode.department}</p>
										</div>
										<div>
											<h3 className='text-sm font-medium text-muted-foreground'>Last Updated</h3>
											<p>{selectedNode.lastUpdated}</p>
										</div>
										<div>
											<h3 className='text-sm font-medium text-muted-foreground'>Purpose</h3>
											<p>{selectedNode.purpose}</p>
										</div>
									</div>

									{selectedNode.remediationStatus && (
										<div>
											<h3 className='text-sm font-medium text-muted-foreground mb-2'>Remediation Status</h3>
											<Badge
												variant={
													selectedNode.remediationStatus === 'Completed'
														? 'secondary'
														: selectedNode.remediationStatus === 'In Progress'
														? 'default'
														: 'outline'
												}
											>
												{selectedNode.remediationStatus}
											</Badge>

											{selectedNode.remediationSteps && (
												<div className='mt-2'>
													<h4 className='text-xs font-medium'>Remediation Steps:</h4>
													<ul className='text-xs list-disc pl-5 mt-1 space-y-1'>
														{selectedNode.remediationSteps.map((step, index) => (
															<li key={index}>{step}</li>
														))}
													</ul>
												</div>
											)}
										</div>
									)}
								</TabsContent>

								<TabsContent value='dependencies' className='p-4 space-y-4'>
									{(() => {
										const connections = getNodeConnections(selectedNode.id)
										return (
											<>
												<div>
													<h3 className='text-sm font-medium mb-2'>Upstream Dependencies (Inputs)</h3>
													{connections.upstream.length > 0 ? (
														<div className='space-y-2'>
															{connections.upstream.map((conn, index) => (
																<div key={index} className='border rounded-md p-2'>
																	<div className='flex items-center justify-between'>
																		<div className='flex items-center gap-2'>
																			<span className='font-medium'>{conn.node?.name}</span>
																			<Badge variant='outline'>{conn.node?.type}</Badge>
																			<Badge
																				variant={
																					conn.relationship === 'input'
																						? 'default'
																						: conn.relationship === 'output'
																						? 'secondary'
																						: 'destructive'
																				}
																			>
																				{conn.relationship}
																			</Badge>
																		</div>
																	</div>
																	{conn.description && (
																		<p className='text-sm text-muted-foreground mt-1'>{conn.description}</p>
																	)}
																</div>
															))}
														</div>
													) : (
														<p className='text-sm text-muted-foreground italic'>No upstream dependencies</p>
													)}
												</div>

												<div>
													<h3 className='text-sm font-medium mb-2'>Downstream Dependencies (Outputs)</h3>
													{connections.downstream.length > 0 ? (
														<div className='space-y-2'>
															{connections.downstream.map((conn, index) => (
																<div key={index} className='border rounded-md p-2'>
																	<div className='flex items-center justify-between'>
																		<div className='flex items-center gap-2'>
																			<span className='font-medium'>{conn.node?.name}</span>
																			<Badge variant='outline'>{conn.node?.type}</Badge>
																			<Badge
																				variant={
																					conn.relationship === 'input'
																						? 'default'
																						: conn.relationship === 'output'
																						? 'secondary'
																						: 'destructive'
																				}
																			>
																				{conn.relationship}
																			</Badge>
																		</div>
																	</div>
																	{conn.description && (
																		<p className='text-sm text-muted-foreground mt-1'>{conn.description}</p>
																	)}
																</div>
															))}
														</div>
													) : (
														<p className='text-sm text-muted-foreground italic'>No downstream dependencies</p>
													)}
												</div>
											</>
										)
									})()}
								</TabsContent>

								<TabsContent value='history' className='p-4'>
									{selectedNode.changeHistory ? (
										<div className='space-y-4'>
											<h3 className='text-sm font-medium'>Change History</h3>
											<div className='border rounded-md'>
												<Table>
													<TableHeader>
														<TableRow>
															<TableHead>Date</TableHead>
															<TableHead>Change</TableHead>
															<TableHead>User</TableHead>
														</TableRow>
													</TableHeader>
													<TableBody>
														{selectedNode.changeHistory.map((change, index) => (
															<TableRow key={index}>
																<TableCell>{change.date}</TableCell>
																<TableCell>{change.change}</TableCell>
																<TableCell>{change.user}</TableCell>
															</TableRow>
														))}
													</TableBody>
												</Table>
											</div>
										</div>
									) : (
										<p className='text-sm text-muted-foreground italic'>No change history available</p>
									)}
								</TabsContent>

								<TabsContent value='model-info' className='p-4'>
									<ModelDetailsCard
										selectedNode={{
											name: selectedNode.name,
											id: selectedNode.id,
											type: selectedNode.type,
											risk: selectedNode.riskRating,
											domain: selectedNode.department,
											team: selectedNode.owner
										}}
										inputs={filteredEdges
											.filter(edge => edge.target === selectedNode.id)
											.map(edge => ({
												node: {
													label: filteredNodes.find(node => node.id === edge.source)?.name,
													name: filteredNodes.find(node => node.id === edge.source)?.name
												},
												link: {
													id: edge.source,
													dependencyType: edge.relationship
												}
											}))}
										outputs={filteredEdges
											.filter(edge => edge.source === selectedNode.id)
											.map(edge => ({
												node: {
													label: filteredNodes.find(node => node.id === edge.target)?.name,
													name: filteredNodes.find(node => node.id === edge.target)?.name
												},
												link: {
													id: edge.target,
													dependencyType: edge.relationship
												}
											}))}
									/>
								</TabsContent>
							</Tabs>
						</CardContent>
					</Card>
				</div>
			)}
		</div>
	)
}
