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

export default function ModelRelationshipGraph() {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const [size, setSize] = useState({ width: 0, height: 0 })
	const { data, isLoading } = useModelGraph()
	const nodePositionsRef = useRef<Record<string, NodePosition>>({})
	const animationRef = useRef<number | null>(null)
	const [selectedNode, setSelectedNode] = useState<string | null>(null)

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
		if (!data || !size.width || !size.height) return

		const existingIds = new Set(Object.keys(nodePositionsRef.current))
		const newIds = new Set(data.nodes.map(node => node.id))

		// Initialize positions for new nodes
		data.nodes.forEach(node => {
			if (!existingIds.has(node.id)) {
				nodePositionsRef.current[node.id] = {
					x: Math.random() * size.width * 0.8 + size.width * 0.1,
					y: Math.random() * size.height * 0.8 + size.height * 0.1,
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
	}, [data, size])

	// Force-directed graph simulation
	const startSimulation = () => {
		if (!data) return

		const simulate = () => {
			if (!canvasRef.current || !data) return

			// Apply forces
			for (let i = 0; i < data.nodes.length; i++) {
				const nodeId = data.nodes[i].id
				const nodePos = nodePositionsRef.current[nodeId]

				if (!nodePos) continue

				// Reset velocities
				nodePos.vx = 0
				nodePos.vy = 0

				// Apply repulsive forces between nodes
				for (let j = 0; j < data.nodes.length; j++) {
					if (i === j) continue

					const otherId = data.nodes[j].id
					const otherPos = nodePositionsRef.current[otherId]

					if (!otherPos) continue

					const dx = nodePos.x - otherPos.x
					const dy = nodePos.y - otherPos.y
					const distance = Math.max(1, Math.sqrt(dx * dx + dy * dy))
					const force = 200 / (distance * distance)

					nodePos.vx += dx * force
					nodePos.vy += dy * force
				}

				// Apply attractive forces along edges
				data.edges.forEach(edge => {
					if (edge.source === nodeId || edge.target === nodeId) {
						const otherId = edge.source === nodeId ? edge.target : edge.source
						const otherPos = nodePositionsRef.current[otherId]

						if (!otherPos) return

						const dx = otherPos.x - nodePos.x
						const dy = otherPos.y - nodePos.y
						const distance = Math.sqrt(dx * dx + dy * dy)
						const force = distance * 0.005

						nodePos.vx += dx * force
						nodePos.vy += dy * force
					}
				})

				// Add centering force
				const centerX = size.width / 2
				const centerY = size.height / 2
				nodePos.vx += (centerX - nodePos.x) * 0.001
				nodePos.vy += (centerY - nodePos.y) * 0.001

				// Apply velocity with damping
				nodePos.x += nodePos.vx * 0.5
				nodePos.y += nodePos.vy * 0.5

				// Constrain to bounds
				nodePos.x = Math.max(50, Math.min(size.width - 50, nodePos.x))
				nodePos.y = Math.max(50, Math.min(size.height - 50, nodePos.y))
			}

			// Render
			renderGraph()

			// Continue simulation
			animationRef.current = requestAnimationFrame(simulate)
		}

		// Start the simulation loop
		animationRef.current = requestAnimationFrame(simulate)
	}

	// Render the graph
	const renderGraph = () => {
		const canvas = canvasRef.current
		if (!canvas || !data) return

		const ctx = canvas.getContext('2d')
		if (!ctx) return

		// Clear canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height)

		// Draw edges
		ctx.strokeStyle = '#aaa'
		ctx.lineWidth = 1
		data.edges.forEach(edge => {
			const sourcePos = nodePositionsRef.current[edge.source]
			const targetPos = nodePositionsRef.current[edge.target]

			if (!sourcePos || !targetPos) return

			ctx.beginPath()
			ctx.moveTo(sourcePos.x, sourcePos.y)
			ctx.lineTo(targetPos.x, targetPos.y)
			ctx.stroke()

			// Draw arrow
			const angle = Math.atan2(targetPos.y - sourcePos.y, targetPos.x - sourcePos.x)
			const arrowSize = 6
			const arrowX = targetPos.x - 12 * Math.cos(angle)
			const arrowY = targetPos.y - 12 * Math.sin(angle)

			ctx.beginPath()
			ctx.moveTo(arrowX, arrowY)
			ctx.lineTo(arrowX - arrowSize * Math.cos(angle - Math.PI / 6), arrowY - arrowSize * Math.sin(angle - Math.PI / 6))
			ctx.lineTo(arrowX - arrowSize * Math.cos(angle + Math.PI / 6), arrowY - arrowSize * Math.sin(angle + Math.PI / 6))
			ctx.closePath()
			ctx.fillStyle = '#aaa'
			ctx.fill()
		})

		// Draw nodes
		data.nodes.forEach(node => {
			const pos = nodePositionsRef.current[node.id]
			if (!pos) return

			// Node circle
			ctx.beginPath()
			ctx.arc(pos.x, pos.y, 12, 0, Math.PI * 2)
			ctx.fillStyle = selectedNode === node.id ? '#3b82f6' : '#1e293b'
			ctx.fill()
			ctx.strokeStyle = '#fff'
			ctx.lineWidth = 1
			ctx.stroke()

			// Node label
			ctx.font = '10px sans-serif'
			ctx.fillStyle = '#000'
			ctx.textAlign = 'center'
			ctx.textBaseline = 'middle'
			ctx.fillText(node.name, pos.x, pos.y + 25)
		})
	}

	// Handle click on canvas
	const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
		if (!data) return

		const canvas = canvasRef.current
		if (!canvas) return

		const rect = canvas.getBoundingClientRect()
		const x = e.clientX - rect.left
		const y = e.clientY - rect.top

		// Check if click is on a node
		for (const node of data.nodes) {
			const pos = nodePositionsRef.current[node.id]
			if (!pos) continue

			const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2))
			if (distance <= 15) {
				setSelectedNode(node.id)
				return
			}
		}

		// If click is not on a node, deselect
		setSelectedNode(null)
	}

	// Find the selected node object
	const getSelectedNodeDetails = () => {
		if (!selectedNode || !data) return null
		return data.nodes.find(node => node.id === selectedNode)
	}

	// Get connections for selected node
	const getNodeConnections = () => {
		if (!selectedNode || !data) return { inputs: [], outputs: [] }

		const inputs = data.edges
			.filter(edge => edge.target === selectedNode)
			.map(edge => {
				const node = data.nodes.find(n => n.id === edge.source)
				return { edge, node }
			})

		const outputs = data.edges
			.filter(edge => edge.source === selectedNode)
			.map(edge => {
				const node = data.nodes.find(n => n.id === edge.target)
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
