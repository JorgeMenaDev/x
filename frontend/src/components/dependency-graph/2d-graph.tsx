'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

// Types for our model data
interface ModelNode {
	id: string
	label: string
	data: {
		name: string
		type: string
		risk: 'high' | 'medium' | 'low'
		domain?: string
		team?: string
	}
}

interface ModelEdge {
	id: string
	source: string
	target: string
	data: {
		dependencyType: string
	}
}

interface ModelGraphData {
	nodes: ModelNode[]
	edges: ModelEdge[]
}

// Improved mock data with more realistic model naming
const mockGraphData: ModelGraphData = {
	nodes: [
		{
			id: 'MDL_P',
			label: 'Model P',
			data: {
				name: 'Pricing Model',
				type: 'Model',
				risk: 'high',
				domain: 'Finance',
				team: 'Pricing Team'
			}
		},
		{
			id: 'MDL_S',
			label: 'Model S',
			data: {
				name: 'Stress Testing',
				type: 'Model',
				risk: 'medium',
				domain: 'Risk',
				team: 'Market Risk Team'
			}
		},
		{
			id: 'MDL_Q',
			label: 'Model Q',
			data: {
				name: 'Liquidity Assessment',
				type: 'Model',
				risk: 'low',
				domain: 'Treasury',
				team: 'Treasury Team'
			}
		},
		{
			id: 'MDL_R',
			label: 'Model R',
			data: {
				name: 'Regulatory Reporting',
				type: 'Model',
				risk: 'high',
				domain: 'Compliance',
				team: 'Regulatory Team'
			}
		},
		{
			id: 'MDL_Z',
			label: 'Model Z',
			data: {
				name: 'Capital Calculation',
				type: 'Model',
				risk: 'medium',
				domain: 'Finance',
				team: 'Capital Team'
			}
		}
	],
	edges: [
		{
			id: 'E1',
			source: 'MDL_P',
			target: 'MDL_S',
			data: {
				dependencyType: 'output'
			}
		},
		{
			id: 'E2',
			source: 'MDL_S',
			target: 'MDL_Q',
			data: {
				dependencyType: 'output'
			}
		},
		{
			id: 'E3',
			source: 'MDL_R',
			target: 'MDL_S',
			data: {
				dependencyType: 'input'
			}
		},
		{
			id: 'E4',
			source: 'MDL_Z',
			target: 'MDL_Q',
			data: {
				dependencyType: 'input'
			}
		},
		{
			id: 'E5',
			source: 'MDL_Z',
			target: 'MDL_P',
			data: {
				dependencyType: 'input'
			}
		}
	]
}

// Component for displaying model details
const ModelDetailsCard = ({ selectedNode, inputs, outputs }) => {
	return (
		<div className='bg-white rounded-lg shadow-md overflow-hidden border border-gray-200'>
			<div className='p-4 border-b border-gray-200 bg-gray-50'>
				<h3 className='text-lg font-semibold'>{selectedNode.name}</h3>
				<div className='flex items-center space-x-2 mt-1'>
					<div className='text-sm text-gray-500'>ID: {selectedNode.id}</div>
					<div className='text-sm text-gray-500'>Type: {selectedNode.type}</div>
				</div>
			</div>

			<div className='p-4 grid grid-cols-2 gap-4'>
				<div>
					<div className='text-sm font-medium text-gray-500'>Risk Level</div>
					<div className='mt-1 flex items-center'>
						<span
							className={`inline-block w-3 h-3 rounded-full mr-2 ${
								selectedNode.risk === 'high'
									? 'bg-red-500'
									: selectedNode.risk === 'medium'
									? 'bg-orange-500'
									: 'bg-green-500'
							}`}
						></span>
						<span className='capitalize'>{selectedNode.risk}</span>
					</div>
				</div>

				<div>
					<div className='text-sm font-medium text-gray-500'>Domain</div>
					<div className='mt-1'>{selectedNode.domain || 'N/A'}</div>
				</div>

				<div>
					<div className='text-sm font-medium text-gray-500'>Team</div>
					<div className='mt-1'>{selectedNode.team || 'N/A'}</div>
				</div>
			</div>

			<div className='p-4 border-t border-gray-200'>
				<h4 className='font-medium mb-2'>Inputs</h4>
				{inputs.length > 0 ? (
					<ul className='space-y-2'>
						{inputs.map((input, index) => (
							<li key={index} className='flex items-center text-sm'>
								<span className='text-blue-600 mr-2'>←</span>
								From {input.node.label || 'Unknown'}
								<span className='text-gray-500 ml-1'>({input.link.dependencyType})</span>
							</li>
						))}
					</ul>
				) : (
					<p className='text-sm text-gray-500'>No inputs</p>
				)}
			</div>

			<div className='p-4 border-t border-gray-200'>
				<h4 className='font-medium mb-2'>Outputs</h4>
				{outputs.length > 0 ? (
					<ul className='space-y-2'>
						{outputs.map((output, index) => (
							<li key={index} className='flex items-center text-sm'>
								<span className='text-blue-600 mr-2'>→</span>
								To {output.node.label || 'Unknown'}
								<span className='text-gray-500 ml-1'>({output.link.dependencyType})</span>
							</li>
						))}
					</ul>
				) : (
					<p className='text-sm text-gray-500'>No outputs</p>
				)}
			</div>
		</div>
	)
}

interface DependencyGraphProps {
	customData?: ModelGraphData
	nodeSize?: number
}

export default function ImprovedDependencyGraph({ customData, nodeSize = 30 }: DependencyGraphProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const [selectedNode, setSelectedNode] = useState<ModelNode | null>(null)
	const [hoveredNode, setHoveredNode] = useState<ModelNode | null>(null)
	const nodePositionsRef = useRef<Record<string, { x: number; y: number }>>({})
	const [devicePixelRatio, setDevicePixelRatio] = useState(1)
	const [graphDimensions, setGraphDimensions] = useState({ width: 0, height: 0 })
	const containerRef = useRef<HTMLDivElement>(null)

	// Use provided data or fallback to mock data
	const graphData = customData || mockGraphData
	const filteredNodes = graphData.nodes
	const filteredEdges = graphData.edges

	// Calculate node positions using Force-Directed Algorithm simulation
	const calculateNodePositions = useCallback(
		(width: number, height: number) => {
			const numNodes = filteredNodes.length
			if (numNodes === 0) return {}

			// Use a force-directed layout algorithm simulation
			// This is a simplified version - a real implementation would use a physics library
			const positions: Record<string, { x: number; y: number }> = {}

			// Initially position in a circle
			const centerX = width / 2
			const centerY = height / 2
			const radius = Math.min(width, height) * 0.35

			filteredNodes.forEach((node, i) => {
				const angle = (i / numNodes) * 2 * Math.PI
				positions[node.id] = {
					x: centerX + radius * Math.cos(angle),
					y: centerY + radius * Math.sin(angle)
				}
			})

			// Adjust to prevent overlap
			// In a real implementation, we'd run multiple iterations of force simulation
			// Here we're just ensuring nodes aren't placed too close to each other
			const minDistance = nodeSize * 3

			for (let i = 0; i < numNodes; i++) {
				const nodeId1 = filteredNodes[i].id
				const pos1 = positions[nodeId1]

				for (let j = i + 1; j < numNodes; j++) {
					const nodeId2 = filteredNodes[j].id
					const pos2 = positions[nodeId2]

					const dx = pos2.x - pos1.x
					const dy = pos2.y - pos1.y
					const distance = Math.sqrt(dx * dx + dy * dy)

					if (distance < minDistance) {
						const adjustX = (minDistance - distance) * (dx / distance) * 0.5
						const adjustY = (minDistance - distance) * (dy / distance) * 0.5

						// Move nodes apart
						if (j > 0) {
							positions[nodeId2].x += adjustX
							positions[nodeId2].y += adjustY
							positions[nodeId1].x -= adjustX
							positions[nodeId1].y -= adjustY
						}
					}
				}
			}

			// Ensure all nodes are within canvas boundaries with padding
			const padding = nodeSize * 2

			Object.keys(positions).forEach(nodeId => {
				const pos = positions[nodeId]
				pos.x = Math.max(padding, Math.min(width - padding, pos.x))
				pos.y = Math.max(padding, Math.min(height - padding, pos.y))
			})

			return positions
		},
		[filteredNodes, nodeSize]
	)

	// Initial render and whenever container size changes
	useEffect(() => {
		if (!containerRef.current) return

		const resizeObserver = new ResizeObserver(entries => {
			for (const entry of entries) {
				const { width, height } = entry.contentRect
				setGraphDimensions({ width, height })
			}
		})

		resizeObserver.observe(containerRef.current)

		return () => {
			if (containerRef.current) {
				resizeObserver.unobserve(containerRef.current)
			}
		}
	}, [])

	// Setup canvas and calculate positions when dimensions change
	useEffect(() => {
		if (!canvasRef.current || graphDimensions.width === 0 || graphDimensions.height === 0) return

		const dpr = window.devicePixelRatio || 1
		setDevicePixelRatio(dpr)

		const { width, height } = graphDimensions

		// Calculate node positions
		const positions = calculateNodePositions(width, height)
		nodePositionsRef.current = positions

		// Set up canvas
		const canvas = canvasRef.current
		const ctx = canvas.getContext('2d', { alpha: false })
		if (!ctx) return

		// Set canvas dimensions accounting for pixel ratio
		canvas.width = width * dpr
		canvas.height = height * dpr

		// Scale canvas correctly
		ctx.scale(dpr, dpr)

		// Set display size via CSS
		canvas.style.width = `${width}px`
		canvas.style.height = `${height}px`

		// Enable anti-aliasing
		ctx.imageSmoothingEnabled = true
		ctx.imageSmoothingQuality = 'high'

		// Draw the graph
		drawGraph(ctx, width, height)
	}, [graphData, nodeSize, graphDimensions, calculateNodePositions])

	// Redraw when selection changes
	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return

		const ctx = canvas.getContext('2d')
		if (!ctx) return

		const width = canvas.width / devicePixelRatio
		const height = canvas.height / devicePixelRatio

		drawGraph(ctx, width, height)
	}, [selectedNode, hoveredNode, devicePixelRatio])

	// Handle mouse interactions
	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return

		const handleMouseMove = (e: MouseEvent) => {
			const rect = canvas.getBoundingClientRect()
			const x = e.clientX - rect.left
			const y = e.clientY - rect.top

			// Check if hovering over a node
			let hovered = null
			for (const node of filteredNodes) {
				const pos = nodePositionsRef.current[node.id]
				if (!pos) continue

				const dx = x - pos.x
				const dy = y - pos.y
				const distance = Math.sqrt(dx * dx + dy * dy)

				if (distance < nodeSize) {
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
			let nodeClicked = false
			let selectedNodeData = null

			for (const node of filteredNodes) {
				const pos = nodePositionsRef.current[node.id]
				if (!pos) continue

				const dx = x - pos.x
				const dy = y - pos.y
				const distance = Math.sqrt(dx * dx + dy * dy)

				if (distance < nodeSize) {
					selectedNodeData = node
					nodeClicked = true
					break
				}
			}

			// If clicking on a node, select it (or deselect if clicking the same node)
			if (nodeClicked && selectedNodeData) {
				// Toggle selection if clicking on the same node
				if (selectedNode && selectedNode.id === selectedNodeData.id) {
					setSelectedNode(null)
				} else {
					setSelectedNode(selectedNodeData)
				}
			} else {
				// If not clicking on a node, deselect
				setSelectedNode(null)
			}
		}

		canvas.addEventListener('mousemove', handleMouseMove)
		canvas.addEventListener('click', handleClick)

		return () => {
			canvas.removeEventListener('mousemove', handleMouseMove)
			canvas.removeEventListener('click', handleClick)
		}
	}, [filteredNodes, nodeSize, selectedNode])

	// Draw the graph
	const drawGraph = useCallback(
		(ctx: CanvasRenderingContext2D, width: number, height: number) => {
			// Clear with solid fill for better performance
			ctx.fillStyle = '#f8fafc' // Light background
			ctx.fillRect(0, 0, width, height)

			// Draw edges first (so they're behind nodes)
			for (const edge of filteredEdges) {
				const sourcePos = nodePositionsRef.current[edge.source]
				const targetPos = nodePositionsRef.current[edge.target]

				if (!sourcePos || !targetPos) continue

				// Check if edge is connected to selected node
				const isSelectedEdge = selectedNode && (selectedNode.id === edge.source || selectedNode.id === edge.target)

				// Calculate the direction vector
				const dx = targetPos.x - sourcePos.x
				const dy = targetPos.y - sourcePos.y
				const length = Math.sqrt(dx * dx + dy * dy)

				// Normalize the direction
				const normalizedDx = dx / length
				const normalizedDy = dy / length

				// Calculate start and end points (offset by node radius)
				const startX = sourcePos.x + normalizedDx * nodeSize
				const startY = sourcePos.y + normalizedDy * nodeSize
				const endX = targetPos.x - normalizedDx * nodeSize
				const endY = targetPos.y - normalizedDy * nodeSize

				// Draw edge line
				ctx.beginPath()
				ctx.moveTo(startX, startY)
				ctx.lineTo(endX, endY)
				ctx.strokeStyle = isSelectedEdge ? '#3b82f6' : '#cbd5e1'
				ctx.lineWidth = isSelectedEdge ? 2.5 : 1.5
				ctx.stroke()

				// Draw arrow
				const arrowLength = 12
				const arrowWidth = 6
				const angle = Math.atan2(dy, dx)

				ctx.beginPath()
				ctx.moveTo(endX, endY)
				ctx.lineTo(
					endX - arrowLength * Math.cos(angle - Math.PI / 6),
					endY - arrowLength * Math.sin(angle - Math.PI / 6)
				)
				ctx.lineTo(
					endX - arrowLength * Math.cos(angle + Math.PI / 6),
					endY - arrowLength * Math.sin(angle + Math.PI / 6)
				)
				ctx.closePath()
				ctx.fillStyle = isSelectedEdge ? '#3b82f6' : '#94a3b8'
				ctx.fill()

				// Edge label for dependency type - only show on hover/selection
				if (isSelectedEdge || (hoveredNode && (hoveredNode.id === edge.source || hoveredNode.id === edge.target))) {
					const midX = (startX + endX) / 2
					const midY = (startY + endY) / 2

					// Background for label
					const labelText = edge.data.dependencyType
					ctx.font = '12px sans-serif'
					const textMetrics = ctx.measureText(labelText)
					const labelWidth = textMetrics.width + 8
					const labelHeight = 20

					ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
					ctx.fillRect(midX - labelWidth / 2, midY - labelHeight / 2, labelWidth, labelHeight)
					ctx.strokeStyle = '#e2e8f0'
					ctx.strokeRect(midX - labelWidth / 2, midY - labelHeight / 2, labelWidth, labelHeight)

					// Text for label
					ctx.fillStyle = '#475569'
					ctx.textAlign = 'center'
					ctx.textBaseline = 'middle'
					ctx.fillText(labelText, midX, midY)
				}
			}

			// Draw nodes
			for (const node of filteredNodes) {
				const pos = nodePositionsRef.current[node.id]
				if (!pos) continue

				// Determine if node is selected or hovered
				const isSelected = selectedNode?.id === node.id
				const isHovered = hoveredNode?.id === node.id
				const isRelated =
					selectedNode &&
					!isSelected &&
					filteredEdges.some(
						edge =>
							(edge.source === selectedNode.id && edge.target === node.id) ||
							(edge.target === selectedNode.id && edge.source === node.id)
					)

				// Add a shadow for selected node
				if (isSelected) {
					ctx.beginPath()
					ctx.arc(pos.x, pos.y, nodeSize + 4, 0, 2 * Math.PI)
					ctx.fillStyle = 'rgba(59, 130, 246, 0.3)'
					ctx.fill()
				}

				// Draw node circle
				ctx.beginPath()
				ctx.arc(pos.x, pos.y, nodeSize, 0, 2 * Math.PI)

				// Set node color based on risk
				let fillColor = '#4f46e5' // Default indigo
				switch (node.data.risk) {
					case 'high':
						fillColor = '#ef4444' // Red
						break
					case 'medium':
						fillColor = '#f97316' // Orange
						break
					case 'low':
						fillColor = '#22c55e' // Green
						break
				}

				ctx.fillStyle = fillColor
				ctx.fill()

				// Add stroke for selected/hovered/related nodes
				if (isSelected || isHovered || isRelated) {
					ctx.strokeStyle = isSelected ? '#3b82f6' : isRelated ? '#8b5cf6' : '#64748b'
					ctx.lineWidth = isSelected ? 3 : 2
					ctx.stroke()
				} else {
					// Standard border
					ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)'
					ctx.lineWidth = 1.5
					ctx.stroke()
				}

				// Draw node label
				const fontSize = Math.max(12, nodeSize * 0.6)
				ctx.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, sans-serif`
				ctx.textAlign = 'center'
				ctx.textBaseline = 'middle'

				// Draw text with slightly transparent white
				ctx.fillStyle = '#ffffff'
				ctx.fillText(node.label, pos.x, pos.y)
			}
		},
		[filteredNodes, filteredEdges, selectedNode, hoveredNode, nodeSize]
	)

	// Get node relationships
	const getNodeRelationships = () => {
		if (!selectedNode) return { inputs: [], outputs: [] }

		const inputs = filteredEdges
			.filter(edge => edge.target === selectedNode.id)
			.map(edge => {
				const sourceNode = filteredNodes.find(node => node.id === edge.source)
				return { edge, node: sourceNode }
			})

		const outputs = filteredEdges
			.filter(edge => edge.source === selectedNode.id)
			.map(edge => {
				const targetNode = filteredNodes.find(node => node.id === edge.target)
				return { edge, node: targetNode }
			})

		return { inputs, outputs }
	}

	const { inputs, outputs } = getNodeRelationships()

	return (
		<div className='flex flex-col space-y-6 w-full'>
			{/* Graph container */}
			<div
				ref={containerRef}
				className='w-full min-h-[500px] relative rounded-lg overflow-hidden shadow-md bg-white border border-gray-200'
			>
				<canvas ref={canvasRef} className='w-full h-full block' />

				{/* Instructions overlay */}
				<div className='absolute top-4 right-4 bg-white bg-opacity-90 p-3 rounded shadow-sm text-sm border border-gray-200'>
					<p className='font-medium text-gray-700'>Click on a node to view details</p>
				</div>
			</div>

			{/* Details container */}
			{selectedNode && (
				<div className='w-full max-w-full mx-auto mb-24 pb-10'>
					<ModelDetailsCard
						selectedNode={{
							name: selectedNode.data.name,
							id: selectedNode.id,
							type: selectedNode.data.type,
							risk: selectedNode.data.risk,
							domain: selectedNode.data.domain,
							team: selectedNode.data.team
						}}
						inputs={inputs.map(({ node, edge }) => ({
							node: {
								label: node?.label,
								name: node?.data.name
							},
							link: {
								id: edge.id,
								dependencyType: edge.data?.dependencyType
							}
						}))}
						outputs={outputs.map(({ node, edge }) => ({
							node: {
								label: node?.label,
								name: node?.data.name
							},
							link: {
								id: edge.id,
								dependencyType: edge.data?.dependencyType
							}
						}))}
					/>
				</div>
			)}
		</div>
	)
}
