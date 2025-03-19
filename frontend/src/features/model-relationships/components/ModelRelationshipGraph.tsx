'use client'

import { useRef, useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useModelGraph } from '../api/get-model-graph'
import { ModelNode, ModelEdge } from '../types'

interface GraphData {
	nodes: ModelNode[]
	edges: ModelEdge[]
}

interface NodePosition {
	id: string
	x: number
	y: number
	width: number
	height: number
}

/**
 * ModelRelationshipGraph displays model relationships in an organization chart style
 */
export default function ModelRelationshipGraph() {
	const { data, isLoading } = useModelGraph() as { data: GraphData | null; isLoading: boolean }
	const [positions, setPositions] = useState<NodePosition[]>([])
	const [selectedNode, setSelectedNode] = useState<string | null>(null)
	const containerRef = useRef<HTMLDivElement>(null)
	const nodesRef = useRef<{ [key: string]: HTMLDivElement }>({})

	// Node dimensions and spacing
	const NODE_WIDTH = 150
	const NODE_HEIGHT = 60
	const VERTICAL_SPACING = 80
	const HORIZONTAL_SPACING = 60

	// Calculate tree width for a node (recursive)
	const calculateTreeWidth = (nodeId: string, level: number, memo: Map<string, number>): number => {
		if (memo.has(nodeId)) return memo.get(nodeId)!
		if (!data) return NODE_WIDTH

		const children = data.edges.filter(edge => edge.source === nodeId).map(edge => edge.target)

		if (children.length === 0) return NODE_WIDTH

		const childrenWidth = children
			.map(childId => calculateTreeWidth(childId, level + 1, memo))
			.reduce((a, b) => a + b, 0)

		const width = Math.max(NODE_WIDTH, childrenWidth + (children.length - 1) * HORIZONTAL_SPACING)
		memo.set(nodeId, width)
		return width
	}

	// Calculate node positions using hierarchical layout
	const calculatePositions = () => {
		if (!data || data.nodes.length === 0) return []

		const positions: NodePosition[] = []
		const memo = new Map<string, number>()

		// Find root nodes (no incoming edges)
		const hasIncoming = new Set(data.edges.map(edge => edge.target))
		const rootNodeIds = data.nodes.filter(node => !hasIncoming.has(node.id)).map(node => node.id)

		if (rootNodeIds.length === 0) return []

		// Start BFS from root nodes
		const queue: { id: string; level: number; offsetX: number }[] = rootNodeIds.map(id => ({
			id,
			level: 0,
			offsetX: 0
		}))

		const seen = new Set<string>()

		while (queue.length > 0) {
			const { id, level, offsetX } = queue.shift()!
			if (seen.has(id)) continue
			seen.add(id)

			const node = data.nodes.find(n => n.id === id)
			if (!node) continue

			const treeWidth = calculateTreeWidth(id, level, memo)
			const x = offsetX + (treeWidth - NODE_WIDTH) / 2

			positions.push({
				id,
				x,
				y: level * (NODE_HEIGHT + VERTICAL_SPACING),
				width: NODE_WIDTH,
				height: NODE_HEIGHT
			})

			// Get children from edges
			const children = data.edges.filter(edge => edge.source === id).map(edge => edge.target)

			let childOffsetX = offsetX

			children.forEach(childId => {
				const childWidth = calculateTreeWidth(childId, level + 1, memo)
				queue.push({
					id: childId,
					level: level + 1,
					offsetX: childOffsetX
				})
				childOffsetX += childWidth + HORIZONTAL_SPACING
			})
		}

		return positions
	}

	// Update positions when data changes or container resizes
	useEffect(() => {
		if (!data) return
		setPositions(calculatePositions())

		const resizeObserver = new ResizeObserver(() => {
			setPositions(calculatePositions())
		})

		if (containerRef.current) {
			resizeObserver.observe(containerRef.current)
		}

		return () => resizeObserver.disconnect()
	}, [data])

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

	// Check if two nodes have a direct connection
	const hasConnection = (sourceId: string, targetId: string) => {
		if (!data) return false
		return data.edges.some(
			edge =>
				(edge.source === sourceId && edge.target === targetId) || (edge.source === targetId && edge.target === sourceId)
		)
	}

	// Create connector SVG paths with improved visualization
	const renderConnectors = () => {
		if (!data) return null

		return data.edges.map(edge => {
			const sourcePos = positions.find(p => p.id === edge.source)
			const targetPos = positions.find(p => p.id === edge.target)

			if (!sourcePos || !targetPos) return null

			const startX = sourcePos.x + NODE_WIDTH / 2
			const startY = sourcePos.y + NODE_HEIGHT
			const endX = targetPos.x + NODE_WIDTH / 2
			const endY = targetPos.y
			const midY = startY + (endY - startY) / 2

			// Determine if edge is related to selected node
			const isHighlighted = selectedNode && (edge.source === selectedNode || edge.target === selectedNode)

			return (
				<svg
					key={`${edge.source}-${edge.target}`}
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						width: '100%',
						height: '100%',
						pointerEvents: 'none'
					}}
				>
					<path
						d={`M ${startX} ${startY} L ${startX} ${midY} L ${endX} ${midY} L ${endX} ${endY}`}
						stroke={isHighlighted ? '#3b82f6' : '#888'}
						strokeWidth={isHighlighted ? '2' : '1'}
						fill='none'
					/>
					<polygon
						points={`${endX},${endY} ${endX - 6},${endY - 6} ${endX + 6},${endY - 6}`}
						fill={isHighlighted ? '#3b82f6' : '#888'}
					/>

					{/* Add small labels to show data flow direction */}
					{isHighlighted && (
						<text
							x={endX}
							y={endY - 10}
							fontSize='10'
							textAnchor='middle'
							fill='#fff'
							style={{
								backgroundColor: '#1e293b',
								padding: '2px',
								borderRadius: '2px'
							}}
						>
							{edge.source === selectedNode ? 'output' : 'input'}
						</text>
					)}
				</svg>
			)
		})
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
				<CardContent className='h-[500px] relative overflow-auto'>
					{isLoading ? (
						<div className='flex items-center justify-center h-full'>
							<p>Loading model relationships...</p>
						</div>
					) : (
						<div
							ref={containerRef}
							className='relative mx-auto'
							style={{
								height: Math.max(...positions.map(p => p.y + p.height + 100), 500),
								width: Math.max(...positions.map(p => p.x + p.width + 100), 500)
							}}
						>
							{renderConnectors()}
							{data?.nodes.map(node => {
								// Determine if node is related to selected node
								const isRelated = selectedNode && (selectedNode === node.id || hasConnection(selectedNode, node.id))

								return (
									<div
										key={node.id}
										ref={el => {
											if (el) nodesRef.current[node.id] = el
										}}
										className={`absolute transition-all duration-200 cursor-pointer
											${selectedNode === node.id ? 'ring-2 ring-blue-500' : ''}
											${isRelated && selectedNode !== node.id ? 'ring-1 ring-blue-400' : ''}`}
										style={{
											left: positions.find(p => p.id === node.id)?.x ?? 0,
											top: positions.find(p => p.id === node.id)?.y ?? 0,
											width: NODE_WIDTH,
											height: NODE_HEIGHT,
											backgroundColor: selectedNode === node.id ? '#3b82f6' : '#1e293b',
											border: '1px solid #fff',
											borderRadius: '4px',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											color: '#fff',
											fontWeight: 'bold',
											opacity: selectedNode && !isRelated ? 0.6 : 1
										}}
										onClick={() => setSelectedNode(node.id === selectedNode ? null : node.id)}
									>
										{node.name}
									</div>
								)
							})}
						</div>
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
												From <span className='font-medium text-blue-500'>{node?.name}</span>
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
												To <span className='font-medium text-blue-500'>{node?.name}</span>
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
