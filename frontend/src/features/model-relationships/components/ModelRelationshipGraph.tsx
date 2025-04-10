'use client'

import { useRef, useEffect, useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import ModelDetailsCard from '@/components/dependency-graph/model-details-card'
import { ZoomIn, ZoomOut, Maximize2, X } from 'lucide-react'

// Type definitions
interface ModelGraphNode {
	id: string
	name: string
	type: string
	riskRating: 'high' | 'medium' | 'low'
	owner: string
	department: string
	lastUpdated: string
	purpose: string
}

interface ModelGraphEdge {
	source: string
	target: string
	relationship: string
	description?: string
}

interface GraphData {
	nodes: ModelGraphNode[]
	edges: ModelGraphEdge[]
}

interface NodePosition {
	id: string
	x: number
	y: number
	width: number
	height: number
}

interface ModelResponse {
	success: boolean
	message: string
	data: ModelRelationship[]
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

// Node dimensions and spacing constants
const NODE_WIDTH = 140
const NODE_HEIGHT = 28
const VERTICAL_SPACING = 40
const HORIZONTAL_SPACING = 24

// Function to transform model data
const transformModelData = (modelResponse: ModelResponse | null): GraphData => {
	const nodes: ModelGraphNode[] = []
	const edges: ModelGraphEdge[] = []
	const processedNodes = new Set<string>()

	// Return empty graph data if response is null or data is missing
	if (!modelResponse || !modelResponse.data || !Array.isArray(modelResponse.data)) {
		return { nodes: [], edges: [] }
	}

	const processRelationship = (relationship: ModelRelationship, parentId?: string) => {
		// Skip if relationship or qmModel is missing
		if (!relationship || !relationship.qmModel) return

		const currentModelId = relationship.qmModel.qmModelId.toString()

		// Add source model node if not already added
		if (!processedNodes.has(currentModelId)) {
			nodes.push({
				id: currentModelId,
				name: relationship.qmModel.qmName,
				type: relationship.qmModel.qmType || 'Model',
				riskRating: 'medium', // Default risk rating - can be adjusted based on business logic
				owner: relationship.qmModel.owner || 'Unknown',
				department: relationship.qmModel.accountableExec || 'Unknown',
				lastUpdated: relationship.qmModel.updatedAt || relationship.qmModel.createdAt,
				purpose: relationship.qmModel.qmPurpose || 'Not specified'
			})
			processedNodes.add(currentModelId)
		}

		// If there's a parent, add the edge
		if (parentId) {
			edges.push({
				source: parentId,
				target: currentModelId,
				relationship: 'input',
				description: 'Model input relationship'
			})
		}

		// Process input models recursively
		if (relationship.inputToModels && Array.isArray(relationship.inputToModels)) {
			relationship.inputToModels.forEach(inputModel => {
				if (inputModel && inputModel.qmModel) {
					const inputModelId = inputModel.qmModel.qmModelId.toString()

					// Add the input model node if not already added
					if (!processedNodes.has(inputModelId)) {
						nodes.push({
							id: inputModelId,
							name: inputModel.qmModel.qmName,
							type: inputModel.qmModel.qmType || 'Model',
							riskRating: 'medium',
							owner: inputModel.qmModel.owner || 'Unknown',
							department: inputModel.qmModel.accountableExec || 'Unknown',
							lastUpdated: inputModel.qmModel.updatedAt || inputModel.qmModel.createdAt,
							purpose: inputModel.qmModel.qmPurpose || 'Not specified'
						})
						processedNodes.add(inputModelId)
					}

					// Add edge from current model to input model
					edges.push({
						source: currentModelId,
						target: inputModelId,
						relationship: 'input',
						description: 'Model input relationship'
					})

					// Process nested relationships
					processRelationship(inputModel, inputModelId)
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

/**
 * ModelRelationshipGraph displays model relationships in an organization chart style
 */
export default function ModelRelationshipGraph() {
	const containerRef = useRef<HTMLDivElement>(null)
	const nodesRef = useRef<{ [key: string]: HTMLDivElement }>({})
	const [modelResponse, setModelResponse] = useState<ModelResponse | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [selectedModelId, setSelectedModelId] = useState(availableModels[0].id)
	const [positions, setPositions] = useState<NodePosition[]>([])
	const [selectedNode, setSelectedNode] = useState<string | null>(null)
	const [zoomLevel, setZoomLevel] = useState(1)
	const [isFullScreen, setIsFullScreen] = useState(false)

	// Zoom control functions
	const handleZoomIn = () => {
		setZoomLevel(prev => Math.min(prev + 0.2, 2))
	}

	const handleZoomOut = () => {
		setZoomLevel(prev => Math.max(prev - 0.2, 0.5))
	}

	const handleResetZoom = () => {
		setZoomLevel(1)
	}

	const handleFullScreen = () => {
		setIsFullScreen(true)
		setZoomLevel(1) // Reset zoom when opening full screen
	}

	// Transform current model data based on selection
	const currentModelData = useMemo(() => {
		if (modelResponse) {
			return transformModelData(modelResponse)
		}
		return { nodes: [], edges: [] }
	}, [modelResponse])

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

	// Function to calculate tree width
	const calculateTreeWidth = (
		nodeId: string,
		level: number,
		memo: Map<string, number>,
		visited: Set<string> = new Set()
	): number => {
		if (memo.has(nodeId)) return memo.get(nodeId)!
		if (!currentModelData.nodes.length || visited.has(nodeId)) return NODE_WIDTH
		visited.add(nodeId)

		const children = currentModelData.edges.filter(edge => edge.source === nodeId).map(edge => edge.target)

		if (children.length === 0) {
			memo.set(nodeId, NODE_WIDTH)
			return NODE_WIDTH
		}

		const childrenWidth = children
			.map(childId => calculateTreeWidth(childId, level + 1, memo, new Set(visited)))
			.reduce((a, b) => a + b, 0)

		const width = Math.max(NODE_WIDTH, childrenWidth + (children.length - 1) * HORIZONTAL_SPACING)
		memo.set(nodeId, width)
		return width
	}

	// Calculate node positions using hierarchical layout
	const calculatePositions = () => {
		if (!currentModelData.nodes.length) return []

		const positions: NodePosition[] = []
		const memo = new Map<string, number>()

		// Find root nodes (no incoming edges)
		const hasIncoming = new Set(currentModelData.edges.map(edge => edge.target))
		const rootNodeIds = currentModelData.nodes.filter(node => !hasIncoming.has(node.id)).map(node => node.id)

		// If no root nodes found, use the first node as root
		if (rootNodeIds.length === 0 && currentModelData.nodes.length > 0) {
			rootNodeIds.push(currentModelData.nodes[0].id)
		}

		// Calculate total width needed for the graph
		const totalWidth = rootNodeIds.reduce((sum, id) => sum + calculateTreeWidth(id, 0, memo), 0)
		let currentX = NODE_WIDTH // Add initial padding

		// Start BFS from root nodes
		const queue: { id: string; level: number; offsetX: number }[] = rootNodeIds.map(id => {
			const width = calculateTreeWidth(id, 0, memo)
			const x = currentX
			currentX += width + HORIZONTAL_SPACING
			return { id, level: 0, offsetX: x }
		})

		const seen = new Set<string>()

		while (queue.length > 0) {
			const { id, level, offsetX } = queue.shift()!
			if (seen.has(id)) continue
			seen.add(id)

			positions.push({
				id,
				x: offsetX,
				y: level * (NODE_HEIGHT + VERTICAL_SPACING) + NODE_HEIGHT, // Add initial vertical padding
				width: NODE_WIDTH,
				height: NODE_HEIGHT
			})

			// Get children from edges
			const children = currentModelData.edges
				.filter(edge => edge.source === id && !seen.has(edge.target))
				.map(edge => edge.target)

			let childOffsetX = offsetX - (children.length * (NODE_WIDTH + HORIZONTAL_SPACING)) / 2 + NODE_WIDTH / 2

			children.forEach(childId => {
				queue.push({
					id: childId,
					level: level + 1,
					offsetX: childOffsetX
				})
				childOffsetX += NODE_WIDTH + HORIZONTAL_SPACING
			})
		}

		// Normalize positions to ensure no negative coordinates
		const minX = Math.min(...positions.map(p => p.x))
		if (minX < 0) {
			positions.forEach(p => (p.x -= minX))
		}

		return positions
	}

	// Update positions when data changes or container resizes
	useEffect(() => {
		if (!currentModelData.nodes.length) return
		setPositions(calculatePositions())

		const resizeObserver = new ResizeObserver(() => {
			setPositions(calculatePositions())
		})

		if (containerRef.current) {
			resizeObserver.observe(containerRef.current)
		}

		return () => resizeObserver.disconnect()
	}, [currentModelData.nodes.length])

	// Find the selected node object
	const getSelectedNodeDetails = () => {
		if (!selectedNode || !currentModelData.nodes.length) return null
		return currentModelData.nodes.find(node => node.id === selectedNode)
	}

	// Get connections for selected node
	const getNodeConnections = () => {
		if (!selectedNode || !currentModelData.nodes.length) return { inputs: [], outputs: [] }

		const inputs = currentModelData.edges
			.filter(edge => edge.target === selectedNode)
			.map(edge => {
				const node = currentModelData.nodes.find(n => n.id === edge.source)
				return { edge, node }
			})

		const outputs = currentModelData.edges
			.filter(edge => edge.source === selectedNode)
			.map(edge => {
				const node = currentModelData.nodes.find(n => n.id === edge.target)
				return { edge, node }
			})

		return { inputs, outputs }
	}

	// Check if two nodes have a direct connection
	const hasConnection = (sourceId: string, targetId: string) => {
		if (!currentModelData.edges.length) return false
		return currentModelData.edges.some(
			edge =>
				(edge.source === sourceId && edge.target === targetId) || (edge.source === targetId && edge.source === sourceId)
		)
	}

	// Create connector SVG paths with improved visualization
	const renderConnectors = () => {
		if (!currentModelData.edges.length) return null

		return currentModelData.edges.map(edge => {
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
		<div className='flex flex-col gap-4'>
			<Card>
				<CardHeader className='flex flex-row items-center justify-between pb-2'>
					<div>
						<CardTitle>Model Relationship Graph</CardTitle>
					</div>
					<div className='flex items-center gap-2'>
						<Select value={selectedModelId} onValueChange={value => setSelectedModelId(value)}>
							<SelectTrigger className='w-[350px]'>
								<span className='truncate'>
									{availableModels.find(model => model.id === selectedModelId)?.name || 'Select Model'}
								</span>
							</SelectTrigger>
							<SelectContent className='min-w-[350px]'>
								{availableModels.map(model => (
									<SelectItem key={model.id} value={model.id} className='truncate'>
										{model.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</CardHeader>
				<CardContent>
					{isLoading ? (
						<div className='flex items-center justify-center h-96'>
							<div className='animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full' />
							<span className='ml-3'>Loading model relationships...</span>
						</div>
					) : !currentModelData.nodes.length ? (
						<div className='flex justify-center items-center h-96'>
							<div className='text-center'>
								<h3 className='text-lg font-semibold'>No data available</h3>
								<p className='text-gray-500'>Select a different model or try again later.</p>
							</div>
						</div>
					) : (
						<div className='relative'>
							<div
								className='absolute right-4 bottom-4 flex gap-2 p-2 bg-gray-800 rounded-lg z-10'
								style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
							>
								<button
									onClick={handleZoomIn}
									className='p-1.5 hover:bg-gray-700 rounded-md text-gray-300 hover:text-white transition-colors'
									title='Zoom In'
								>
									<ZoomIn size={18} />
								</button>
								<button
									onClick={handleZoomOut}
									className='p-1.5 hover:bg-gray-700 rounded-md text-gray-300 hover:text-white transition-colors'
									title='Zoom Out'
								>
									<ZoomOut size={18} />
								</button>
								<button
									onClick={handleFullScreen}
									className='p-1.5 hover:bg-gray-700 rounded-md text-gray-300 hover:text-white transition-colors'
									title='Full Screen'
								>
									<Maximize2 size={18} />
								</button>
							</div>
							<div
								ref={containerRef}
								className='relative overflow-auto border rounded-lg'
								style={{
									height: '400px',
									width: '100%',
									minWidth: '800px'
								}}
							>
								<div
									className='absolute p-8'
									style={{
										height: Math.max(...positions.map(p => p.y + NODE_HEIGHT + 30), 400),
										width: Math.max(...positions.map(p => p.x + NODE_WIDTH + 30), 800),
										minWidth: '100%',
										transform: `scale(${zoomLevel})`,
										transformOrigin: '0 0',
										transition: 'transform 0.2s ease-out'
									}}
								>
									{renderConnectors()}
									{currentModelData.nodes.map(node => {
										const nodePosition = positions.find(p => p.id === node.id)
										const isRelated = selectedNode && (selectedNode === node.id || hasConnection(selectedNode, node.id))

										if (!nodePosition) return null

										return (
											<div
												key={node.id}
												ref={el => {
													if (el) nodesRef.current[node.id] = el
												}}
												className={`absolute transition-all duration-200 cursor-pointer
													${selectedNode === node.id ? 'ring-1 ring-blue-500' : ''}
													${isRelated && selectedNode !== node.id ? 'ring-1 ring-blue-400' : ''}`}
												style={{
													left: nodePosition.x,
													top: nodePosition.y,
													width: NODE_WIDTH,
													height: NODE_HEIGHT,
													backgroundColor: selectedNode === node.id ? '#3b82f6' : '#1e293b',
													border: '1px solid rgba(255,255,255,0.6)',
													borderRadius: '3px',
													display: 'flex',
													alignItems: 'center',
													justifyContent: 'center',
													color: '#fff',
													padding: '2px 6px',
													opacity: selectedNode && !isRelated ? 0.6 : 1,
													fontSize: '0.7rem',
													lineHeight: '0.9rem',
													textAlign: 'center',
													wordBreak: 'break-word',
													whiteSpace: 'nowrap',
													overflow: 'hidden',
													textOverflow: 'ellipsis'
												}}
												onClick={() => setSelectedNode(node.id === selectedNode ? null : node.id)}
												title={node.name}
											>
												{node.name}
											</div>
										)
									})}
								</div>
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Full Screen Modal */}
			{isFullScreen && (
				<div
					className='fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-8'
					onClick={e => {
						if (e.target === e.currentTarget) setIsFullScreen(false)
					}}
				>
					<div className='absolute bottom-4 right-4 flex gap-2 p-2 bg-gray-800 rounded-lg'>
						<button
							onClick={handleZoomIn}
							className='p-1.5 hover:bg-gray-700 rounded-md text-gray-300 hover:text-white transition-colors'
							title='Zoom In'
						>
							<ZoomIn size={18} />
						</button>
						<button
							onClick={handleZoomOut}
							className='p-1.5 hover:bg-gray-700 rounded-md text-gray-300 hover:text-white transition-colors'
							title='Zoom Out'
						>
							<ZoomOut size={18} />
						</button>
					</div>
					<button
						onClick={() => setIsFullScreen(false)}
						className='absolute top-4 right-4 p-2 hover:bg-gray-700 rounded-lg text-gray-300 hover:text-white transition-colors'
						title='Close Full Screen'
					>
						<X size={24} />
					</button>
					<div
						className='w-[95vw] h-[90vh] relative overflow-auto mt-8'
						style={{
							backgroundColor: '#1e293b',
							borderRadius: '8px'
						}}
					>
						<div
							className='absolute p-4'
							style={{
								height: `${Math.max(...positions.map(p => p.y + NODE_HEIGHT + 30))}px`,
								width: `${Math.max(...positions.map(p => p.x + NODE_WIDTH + 30))}px`,
								minWidth: '100%',
								minHeight: '100%',
								transform: `scale(${zoomLevel})`,
								transformOrigin: '0 0',
								transition: 'transform 0.2s ease-out'
							}}
						>
							{renderConnectors()}
							{currentModelData.nodes.map(node => {
								const nodePosition = positions.find(p => p.id === node.id)
								const isRelated = selectedNode && (selectedNode === node.id || hasConnection(selectedNode, node.id))

								if (!nodePosition) return null

								return (
									<div
										key={node.id}
										ref={el => {
											if (el) nodesRef.current[node.id] = el
										}}
										className={`absolute transition-all duration-200 cursor-pointer
											${selectedNode === node.id ? 'ring-1 ring-blue-500' : ''}
											${isRelated && selectedNode !== node.id ? 'ring-1 ring-blue-400' : ''}`}
										style={{
											left: nodePosition.x,
											top: nodePosition.y,
											width: NODE_WIDTH,
											height: NODE_HEIGHT,
											backgroundColor: selectedNode === node.id ? '#3b82f6' : '#1e293b',
											border: '1px solid rgba(255,255,255,0.6)',
											borderRadius: '3px',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											color: '#fff',
											padding: '2px 6px',
											opacity: selectedNode && !isRelated ? 0.6 : 1,
											fontSize: '0.7rem',
											lineHeight: '0.9rem',
											textAlign: 'center',
											wordBreak: 'break-word',
											whiteSpace: 'nowrap',
											overflow: 'hidden',
											textOverflow: 'ellipsis'
										}}
										onClick={() => setSelectedNode(node.id === selectedNode ? null : node.id)}
										title={node.name}
									>
										{node.name}
									</div>
								)
							})}
						</div>
					</div>
				</div>
			)}

			{selectedNodeDetails && (
				<ModelDetailsCard
					selectedNode={{
						name: selectedNodeDetails.name,
						id: selectedNodeDetails.id,
						type: String(selectedNodeDetails.type || 'Unknown'),
						risk: 'medium',
						domain: selectedNodeDetails.purpose?.toString(),
						team: selectedNodeDetails.owner
					}}
					inputs={inputs.map(({ node, edge }) => ({
						node: {
							name: node?.name,
							label: node?.name
						},
						link: {
							id: edge.source,
							dependencyType: edge.description
						}
					}))}
					outputs={outputs.map(({ node, edge }) => ({
						node: {
							name: node?.name,
							label: node?.name
						},
						link: {
							id: edge.target,
							dependencyType: edge.description
						}
					}))}
				/>
			)}
		</div>
	)
}
