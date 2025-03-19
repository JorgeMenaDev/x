'use client'

import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useModelGraph } from '../api/get-model-graph'
import { ModelNode, ModelEdge, ModelGraph } from '../types'

// Force-directed graph simulation
interface NodePosition {
	x: number
	y: number
	vx: number
	vy: number
}

interface GraphData {
	nodes: ModelNode[]
	edges: ModelEdge[]
}

export default function ModelRelationshipGraph() {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const [size, setSize] = useState({ width: 0, height: 0 })
	const { data, isLoading } = useModelGraph() as { data: GraphData | null; isLoading: boolean }
	const graphData: GraphData = data || { nodes: [], edges: [] }
	const nodePositionsRef = useRef<Record<string, NodePosition>>({})
	const animationRef = useRef<number | null>(null)
	const [selectedNode, setSelectedNode] = useState<string | null>(null)
	const [isStable, setIsStable] = useState(false)

	// Setup canvas and animation
	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return

		// Resize handler
		const resizeCanvas = () => {
			const parent = canvas.parentElement
			if (!parent) return

			const { width, height } = parent.getBoundingClientRect()
			canvas.width = width
			canvas.height = height
			setSize({ width, height })
		}

		// Initialize canvas size
		resizeCanvas()

		// Handle window resize
		window.addEventListener('resize', resizeCanvas)

		return () => {
			window.removeEventListener('resize', resizeCanvas)
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current)
			}
		}
	}, [])

	// Initialize node positions or update when data changes
	useEffect(() => {
		if (!graphData || !size.width || !size.height) return

		// Reset stability when data changes
		setIsStable(false)

		const existingIds = new Set(Object.keys(nodePositionsRef.current))
		const newIds = new Set(graphData.nodes.map(node => node.id))

		// Initialize positions for new nodes in a hierarchical layout
		const levels: { [key: string]: number } = {}
		const visited = new Set<string>()

		// Helper function to determine node level
		const assignLevels = (nodeId: string, level: number) => {
			if (visited.has(nodeId)) return
			visited.add(nodeId)
			levels[nodeId] = Math.max(level, levels[nodeId] || 0)

			// Find children (nodes this node points to)
			const edges = graphData.edges.filter(edge => edge.source === nodeId)
			edges.forEach(edge => {
				assignLevels(edge.target, level + 1)
			})
		}

		// Find root nodes (nodes with no incoming edges)
		const hasIncoming = new Set(graphData.edges.map(edge => edge.target))
		const rootNodes = graphData.nodes.filter(node => !hasIncoming.has(node.id))

		// Assign levels starting from root nodes
		rootNodes.forEach(node => assignLevels(node.id, 0))

		// Calculate maximum level
		const maxLevel = Math.max(...Object.values(levels))

		// Initialize positions based on levels
		graphData.nodes.forEach(node => {
			if (!existingIds.has(node.id)) {
				const level = levels[node.id] || 0
				const nodesAtLevel = Object.entries(levels).filter(([, l]) => l === level).length
				const index = Object.entries(levels)
					.filter(([, l]) => l === level)
					.findIndex(([id]) => id === node.id)

				nodePositionsRef.current[node.id] = {
					x: (size.width * (level + 1)) / (maxLevel + 2),
					y: (size.height * (index + 1)) / (nodesAtLevel + 1),
					vx: 0,
					vy: 0
				}
			}
		})

		// Remove positions for nodes that no longer exist
		existingIds.forEach(id => {
			if (!newIds.has(id)) {
				delete nodePositionsRef.current[id]
			}
		})

		// Start simulation if not already running
		if (!animationRef.current) {
			startSimulation()
		}
	}, [graphData, size])

	// Force-directed graph simulation
	const startSimulation = () => {
		if (!graphData) return

		let iterations = 0
		const maxIterations = 200
		let totalMovement = 0

		const simulate = () => {
			if (!canvasRef.current || !graphData) return

			totalMovement = 0

			// Apply forces
			for (let i = 0; i < graphData.nodes.length; i++) {
				const nodeId = graphData.nodes[i].id
				const nodePos = nodePositionsRef.current[nodeId]

				if (!nodePos) continue

				const originalX = nodePos.x
				const originalY = nodePos.y

				// Reset velocities
				nodePos.vx = 0
				nodePos.vy = 0

				// Apply repulsive forces between nodes
				for (let j = 0; j < graphData.nodes.length; j++) {
					if (i === j) continue

					const otherId = graphData.nodes[j].id
					const otherPos = nodePositionsRef.current[otherId]

					if (!otherPos) continue

					const dx = nodePos.x - otherPos.x
					const dy = nodePos.y - otherPos.y
					const distance = Math.max(1, Math.sqrt(dx * dx + dy * dy))
					const force = 2000 / (distance * distance)

					nodePos.vx += dx * force
					nodePos.vy += dy * force
				}

				// Apply attractive forces along edges
				graphData.edges.forEach(edge => {
					if (edge.source === nodeId || edge.target === nodeId) {
						const otherId = edge.source === nodeId ? edge.target : edge.source
						const otherPos = nodePositionsRef.current[otherId]

						if (!otherPos) return

						const dx = otherPos.x - nodePos.x
						const dy = otherPos.y - nodePos.y
						const distance = Math.sqrt(dx * dx + dy * dy)
						const force = distance * 0.01

						nodePos.vx += dx * force
						nodePos.vy += dy * force
					}
				})

				// Apply velocity with damping
				nodePos.x += nodePos.vx * 0.3
				nodePos.y += nodePos.vy * 0.3

				// Constrain to bounds
				nodePos.x = Math.max(50, Math.min(size.width - 50, nodePos.x))
				nodePos.y = Math.max(50, Math.min(size.height - 50, nodePos.y))

				// Calculate movement
				const dx = nodePos.x - originalX
				const dy = nodePos.y - originalY
				totalMovement += Math.sqrt(dx * dx + dy * dy)
			}

			// Render
			renderGraph()

			iterations++

			// Check if simulation should continue
			if (iterations < maxIterations && totalMovement > 0.1) {
				animationRef.current = requestAnimationFrame(simulate)
			} else {
				setIsStable(true)
				animationRef.current = null
			}
		}

		// Start the simulation loop
		animationRef.current = requestAnimationFrame(simulate)
	}

	// Render the graph
	const renderGraph = () => {
		const canvas = canvasRef.current
		if (!canvas || !graphData) return

		const ctx = canvas.getContext('2d')
		if (!ctx) return

		// Clear canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height)

		// Draw edges
		ctx.strokeStyle = '#aaa'
		ctx.lineWidth = 1
		graphData.edges.forEach(edge => {
			const sourcePos = nodePositionsRef.current[edge.source]
			const targetPos = nodePositionsRef.current[edge.target]

			if (!sourcePos || !targetPos) return

			// Calculate the direction vector
			const dx = targetPos.x - sourcePos.x
			const dy = targetPos.y - sourcePos.y
			const distance = Math.sqrt(dx * dx + dy * dy)

			// Calculate start and end points (offset from node centers)
			const nodeRadius = 15
			const startX = sourcePos.x + (dx * nodeRadius) / distance
			const startY = sourcePos.y + (dy * nodeRadius) / distance
			const endX = targetPos.x - (dx * nodeRadius) / distance
			const endY = targetPos.y - (dy * nodeRadius) / distance

			// Draw the line
			ctx.beginPath()
			ctx.moveTo(startX, startY)
			ctx.lineTo(endX, endY)
			ctx.stroke()

			// Draw arrow
			const angle = Math.atan2(dy, dx)
			const arrowSize = 8
			const arrowX = endX
			const arrowY = endY

			ctx.beginPath()
			ctx.moveTo(arrowX, arrowY)
			ctx.lineTo(arrowX - arrowSize * Math.cos(angle - Math.PI / 6), arrowY - arrowSize * Math.sin(angle - Math.PI / 6))
			ctx.lineTo(arrowX - arrowSize * Math.cos(angle + Math.PI / 6), arrowY - arrowSize * Math.sin(angle + Math.PI / 6))
			ctx.closePath()
			ctx.fillStyle = '#aaa'
			ctx.fill()
		})

		// Draw nodes
		graphData.nodes.forEach(node => {
			const pos = nodePositionsRef.current[node.id]
			if (!pos) return

			// Node circle with larger radius
			ctx.beginPath()
			ctx.arc(pos.x, pos.y, 15, 0, Math.PI * 2)
			ctx.fillStyle = selectedNode === node.id ? '#3b82f6' : '#1e293b'
			ctx.fill()
			ctx.strokeStyle = '#fff'
			ctx.lineWidth = 2
			ctx.stroke()

			// Node label with larger font and background
			const label = node.name
			ctx.font = 'bold 12px sans-serif'
			const textMetrics = ctx.measureText(label)
			const textWidth = textMetrics.width
			const padding = 4

			// Draw label background
			ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
			ctx.fillRect(pos.x - textWidth / 2 - padding, pos.y + 20 - padding, textWidth + padding * 2, 20)

			// Draw label text
			ctx.fillStyle = '#000'
			ctx.textAlign = 'center'
			ctx.textBaseline = 'middle'
			ctx.fillText(label, pos.x, pos.y + 25)
		})
	}

	// Handle click on canvas
	const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
		if (!graphData || !isStable) return

		const canvas = canvasRef.current
		if (!canvas) return

		const rect = canvas.getBoundingClientRect()
		const x = e.clientX - rect.left
		const y = e.clientY - rect.top

		// Scale coordinates if canvas is scaled
		const scaleX = canvas.width / rect.width
		const scaleY = canvas.height / rect.height
		const canvasX = x * scaleX
		const canvasY = y * scaleY

		// Check if click is on a node
		let clickedNode = null
		for (const node of graphData.nodes) {
			const pos = nodePositionsRef.current[node.id]
			if (!pos) continue

			const distance = Math.sqrt(Math.pow(canvasX - pos.x, 2) + Math.pow(canvasY - pos.y, 2))
			if (distance <= 15) {
				clickedNode = node
				break
			}
		}

		setSelectedNode(clickedNode ? clickedNode.id : null)
	}

	// Find the selected node object
	const getSelectedNodeDetails = () => {
		if (!selectedNode || !graphData) return null
		return graphData.nodes.find(node => node.id === selectedNode)
	}

	// Get connections for selected node
	const getNodeConnections = () => {
		if (!selectedNode || !graphData) return { inputs: [], outputs: [] }

		const inputs = graphData.edges
			.filter(edge => edge.target === selectedNode)
			.map(edge => {
				const node = graphData.nodes.find(n => n.id === edge.source)
				return { edge, node }
			})

		const outputs = graphData.edges
			.filter(edge => edge.source === selectedNode)
			.map(edge => {
				const node = graphData.nodes.find(n => n.id === edge.target)
				return { edge, node }
			})

		return { inputs, outputs }
	}

	// Selected node information
	const selectedNodeDetails = getSelectedNodeDetails()
	const { inputs, outputs } = getNodeConnections()

	return (
		<div className='flex flex-col gap-4 h-full'>
			<Card className='flex-1'>
				<CardHeader>
					<CardTitle>Model Relationship Graph</CardTitle>
				</CardHeader>
				<CardContent className='h-[500px] relative'>
					{isLoading ? (
						<div className='flex items-center justify-center h-full'>
							<p>Loading model relationships...</p>
						</div>
					) : (
						<canvas ref={canvasRef} className='w-full h-full cursor-pointer' onClick={handleCanvasClick} />
					)}
				</CardContent>
			</Card>

			{selectedNodeDetails && (
				<Card>
					<CardHeader>
						<CardTitle>{selectedNodeDetails.name}</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='grid gap-4'>
							<div>
								<h3 className='text-sm font-medium'>Model Details</h3>
								<p className='text-sm text-muted-foreground'>ID: {selectedNodeDetails.id}</p>
								<p className='text-sm text-muted-foreground'>Owner: {selectedNodeDetails.owner}</p>
								{selectedNodeDetails.accountableExec && (
									<p className='text-sm text-muted-foreground'>
										Accountable Exec: {selectedNodeDetails.accountableExec}
									</p>
								)}
							</div>

							<div>
								<h3 className='text-sm font-medium'>Inputs</h3>
								{inputs.length > 0 ? (
									<ul className='text-sm'>
										{inputs.map(({ node, edge }) => (
											<li key={edge.source} className='mt-1'>
												From <span className='font-medium'>{node?.name}</span>
												{edge.description && <span className='text-muted-foreground'> - {edge.description}</span>}
											</li>
										))}
									</ul>
								) : (
									<p className='text-sm text-muted-foreground'>No inputs</p>
								)}
							</div>

							<div>
								<h3 className='text-sm font-medium'>Outputs</h3>
								{outputs.length > 0 ? (
									<ul className='text-sm'>
										{outputs.map(({ node, edge }) => (
											<li key={edge.target} className='mt-1'>
												To <span className='font-medium'>{node?.name}</span>
												{edge.description && <span className='text-muted-foreground'> - {edge.description}</span>}
											</li>
										))}
									</ul>
								) : (
									<p className='text-sm text-muted-foreground'>No outputs</p>
								)}
							</div>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	)
}
