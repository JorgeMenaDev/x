'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Download, Filter, X } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

// Types for our model data
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

// Map model IDs to their data
const MODEL_DATA_MAP = {
	MODEL_1: MODEL_1_DATA,
	MODEL_2: MODEL_2_DATA,
	MODEL_3: MODEL_3_DATA,
	MODEL_4: MODEL_4_DATA
}

// Add root models for dropdown selection
const rootModels = [
	{ id: 'MODEL_1', name: 'Credit Risk Assessment Model', data: MODEL_1_DATA },
	{ id: 'MODEL_2', name: 'Loan Pricing Model', data: MODEL_2_DATA },
	{ id: 'MODEL_3', name: 'Portfolio Risk Model', data: MODEL_3_DATA },
	{ id: 'MODEL_4', name: 'Market Risk Model', data: MODEL_4_DATA }
]

export default function DefaultDependencyGraph() {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const [selectedNode, setSelectedNode] = useState<ModelNode | null>(null)
	const [hoveredNode, setHoveredNode] = useState<ModelNode | null>(null)
	const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
	const [filters, setFilters] = useState({
		riskLevels: { high: true, medium: true, low: true },
		departments: new Set(mockGraphData.nodes.map(node => node.department)),
		owners: new Set(mockGraphData.nodes.map(node => node.owner))
	})
	const [showFilters, setShowFilters] = useState(false)
	const [isSimulationStable, setIsSimulationStable] = useState(false)
	const nodePositionsRef = useRef<{ [key: string]: { x: number; y: number; vx: number; vy: number } }>({})
	const animationRef = useRef<number | null>(null)
	const [selectedModelId, setSelectedModelId] = useState('MODEL_1')

	// Get current model data
	const currentModelData = MODEL_DATA_MAP[selectedModelId as keyof typeof MODEL_DATA_MAP]

	// Get unique departments and owners for filters
	const departments = Array.from(new Set(currentModelData.nodes.map(node => node.department)))
	const owners = Array.from(new Set(currentModelData.nodes.map(node => node.owner)))

	// Filter nodes based on current filters
	const filteredNodes = currentModelData.nodes.filter(
		node =>
			filters.riskLevels[node.riskRating as keyof typeof filters.riskLevels] &&
			filters.departments.has(node.department) &&
			filters.owners.has(node.owner)
	)

	// Get filtered node IDs for edge filtering
	const filteredNodeIds = new Set(filteredNodes.map(node => node.id))

	// Filter edges to only include connections between visible nodes
	const filteredEdges = currentModelData.edges.filter(
		edge => filteredNodeIds.has(edge.source) && filteredNodeIds.has(edge.target)
	)

	// Update filters when model changes
	useEffect(() => {
		const modelData = MODEL_DATA_MAP[selectedModelId as keyof typeof MODEL_DATA_MAP]
		setFilters({
			riskLevels: { high: true, medium: true, low: true },
			departments: new Set(modelData.nodes.map(node => node.department)),
			owners: new Set(modelData.nodes.map(node => node.owner))
		})
		setSelectedNode(null)
		setIsSimulationStable(false)
	}, [selectedModelId])

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

	// Render the graph
	const renderGraph = useCallback(() => {
		const canvas = canvasRef.current
		if (!canvas) return

		const ctx = canvas.getContext('2d')
		if (!ctx) return

		const nodePositions = nodePositionsRef.current

		ctx.clearRect(0, 0, canvas.width, canvas.height)

		// Draw edges
		ctx.lineWidth = 1
		filteredEdges.forEach(edge => {
			const pos1 = nodePositions[edge.source]
			const pos2 = nodePositions[edge.target]
			if (!pos1 || !pos2) return

			// Highlight edges connected to selected node
			const isSelected = selectedNode && (selectedNode.id === edge.source || selectedNode.id === edge.target)

			ctx.beginPath()
			ctx.moveTo(pos1.x, pos1.y)
			ctx.lineTo(pos2.x, pos2.y)

			// Edge color based on relationship and selection
			let strokeStyle
			switch (edge.relationship) {
				case 'input':
					strokeStyle = isSelected ? '#60a5fa' : '#3b82f6' // Brighter blue when selected
					break
				case 'output':
					strokeStyle = isSelected ? '#a78bfa' : '#8b5cf6' // Brighter purple when selected
					break
				case 'calculation':
					strokeStyle = isSelected ? '#fb923c' : '#f97316' // Brighter orange when selected
					break
				default:
					strokeStyle = isSelected ? '#d1d5db' : '#9ca3af' // Brighter gray when selected
			}

			ctx.strokeStyle = strokeStyle
			ctx.lineWidth = isSelected ? 2 : 1
			ctx.stroke()

			// Draw arrow
			const angle = Math.atan2(pos2.y - pos1.y, pos2.x - pos1.x)
			const arrowSize = isSelected ? 10 : 8

			ctx.beginPath()
			ctx.moveTo(pos2.x - arrowSize * Math.cos(angle - Math.PI / 6), pos2.y - arrowSize * Math.sin(angle - Math.PI / 6))
			ctx.lineTo(pos2.x, pos2.y)
			ctx.lineTo(pos2.x - arrowSize * Math.cos(angle + Math.PI / 6), pos2.y - arrowSize * Math.sin(angle + Math.PI / 6))
			ctx.fillStyle = strokeStyle
			ctx.fill()
		})

		// Draw nodes
		filteredNodes.forEach(node => {
			const pos = nodePositions[node.id]
			if (!pos) return

			const isSelected = selectedNode && selectedNode.id === node.id
			const isHovered = hoveredNode && hoveredNode.id === node.id

			// Node circle
			ctx.beginPath()
			ctx.arc(pos.x, pos.y, isSelected || isHovered ? 22 : 20, 0, Math.PI * 2)
			ctx.fillStyle = getRiskColor(node.riskRating)
			ctx.fill()

			// Node border
			ctx.strokeStyle = isSelected ? '#000000' : '#ffffff'
			ctx.lineWidth = isSelected || isHovered ? 3 : 2
			ctx.stroke()

			// Node label
			ctx.fillStyle = '#ffffff'
			ctx.font = isSelected || isHovered ? 'bold 10px Arial' : '10px Arial'
			ctx.textAlign = 'center'
			ctx.textBaseline = 'middle'
			ctx.fillText(node.id, pos.x, pos.y)
		})

		// Draw tooltip for hovered node
		if (hoveredNode) {
			const pos = nodePositions[hoveredNode.id]
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

		animationRef.current = requestAnimationFrame(renderGraph)
	}, [filteredNodes, filteredEdges, selectedNode, hoveredNode, mousePos, isSimulationStable, runPhysicsSimulation])

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

		const handleMouseMove = (e: MouseEvent) => {
			const rect = canvas.getBoundingClientRect()
			const x = e.clientX - rect.left
			const y = e.clientY - rect.top
			setMousePos({ x, y })

			// Check if hovering over a node
			let hovered = null
			for (const node of filteredNodes) {
				const pos = nodePositionsRef.current[node.id]
				if (!pos) continue

				const dx = x - pos.x
				const dy = y - pos.y
				const distance = Math.sqrt(dx * dx + dy * dy)

				if (distance < 20) {
					hovered = node
					break
				}
			}

			setHoveredNode(hovered)
			canvas.style.cursor = hovered ? 'pointer' : 'default'
		}

		const handleClick = (e: MouseEvent) => {
			const rect = canvas.getBoundingClientRect()
			const x = e.clientX - rect.left
			const y = e.clientY - rect.top

			// Check if clicking on a node
			for (const node of filteredNodes) {
				const pos = nodePositionsRef.current[node.id]
				if (!pos) continue

				const dx = x - pos.x
				const dy = y - pos.y
				const distance = Math.sqrt(dx * dx + dy * dy)

				if (distance < 20) {
					setSelectedNode(node)
					return
				}
			}

			// If not clicking on a node, deselect
			setSelectedNode(null)
		}

		canvas.addEventListener('mousemove', handleMouseMove)
		canvas.addEventListener('click', handleClick)

		return () => {
			canvas.removeEventListener('mousemove', handleMouseMove)
			canvas.removeEventListener('click', handleClick)
		}
	}, [filteredNodes])

	return (
		<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
			<div className={`${selectedNode ? 'md:col-span-2' : 'md:col-span-3'}`}>
				<Card className='w-full'>
					<CardHeader className='flex flex-row items-center justify-between pb-2'>
						<div>
							<CardTitle>Model Dependency Graph</CardTitle>
							<CardDescription>Interactive visualization of model relationships and dependencies</CardDescription>
						</div>
						<div className='flex items-center gap-2'>
							<Select value={selectedModelId} onValueChange={value => setSelectedModelId(value)}>
								<SelectTrigger className='w-[200px]'>
									<span>Select Model</span>
								</SelectTrigger>
								<SelectContent>
									{rootModels.map(model => (
										<SelectItem key={model.id} value={model.id}>
											{model.name}
										</SelectItem>
									))}
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
											<Label htmlFor='filter-high' className='flex items-center text-white'>
												<div className='w-3 h-3 rounded-full bg-red-500 mr-2'></div>
												<span className='text-white'>High Risk</span>
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
								<span className='text-sm text-white'>High Risk</span>
							</div>
							<div className='flex items-center gap-2'>
								<div className='w-3 h-3 rounded-full bg-orange-500'></div>
								<span className='text-sm text-white'>Medium Risk</span>
							</div>
							<div className='flex items-center gap-2'>
								<div className='w-3 h-3 rounded-full bg-green-500'></div>
								<span className='text-sm text-white'>Low Risk</span>
							</div>
						</div>
						<canvas ref={canvasRef} className='w-full border rounded-md' style={{ height: '500px' }} />
						<div className='mt-4 text-sm text-muted-foreground'>
							<p>Click on a node to view detailed information. Hover over nodes for quick details.</p>
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
									<div className='space-y-4'>
										<div>
											<h3 className='text-sm font-medium mb-2'>Model Information</h3>
											<div className='grid grid-cols-2 gap-4'>
												<div>
													<h4 className='text-sm font-medium text-muted-foreground'>Model Type</h4>
													<p>{selectedNode.type}</p>
												</div>
												<div>
													<h4 className='text-sm font-medium text-muted-foreground'>Purpose</h4>
													<p>{selectedNode.purpose}</p>
												</div>
												<div>
													<h4 className='text-sm font-medium text-muted-foreground'>Last Updated</h4>
													<p>{selectedNode.lastUpdated}</p>
												</div>
												<div>
													<h4 className='text-sm font-medium text-muted-foreground'>Department</h4>
													<p>{selectedNode.department}</p>
												</div>
											</div>
										</div>

										{selectedNode.remediationStatus && (
											<div>
												<h3 className='text-sm font-medium mb-2'>Remediation Details</h3>
												<div className='space-y-2'>
													<div>
														<h4 className='text-sm font-medium text-muted-foreground'>Status</h4>
														<Badge variant={selectedNode.remediationStatus === 'Completed' ? 'secondary' : 'outline'}>
															{selectedNode.remediationStatus}
														</Badge>
													</div>
													{selectedNode.remediationSteps && (
														<div>
															<h4 className='text-sm font-medium text-muted-foreground'>Steps</h4>
															<ul className='list-disc pl-4 space-y-1'>
																{selectedNode.remediationSteps.map((step, index) => (
																	<li key={index} className='text-sm'>
																		{step}
																	</li>
																))}
															</ul>
														</div>
													)}
												</div>
											</div>
										)}
									</div>
								</TabsContent>
							</Tabs>
						</CardContent>
					</Card>
				</div>
			)}
		</div>
	)
}
