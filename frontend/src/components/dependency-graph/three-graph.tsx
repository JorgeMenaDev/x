'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import ForceGraph3D from 'react-force-graph-3d'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import * as THREE from 'three'

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

// Graph data structure for ForceGraph
interface GraphData {
	nodes: GraphNode[]
	links: GraphLink[]
}

interface GraphNode {
	id: string
	name: string
	label: string
	type: string
	risk: 'high' | 'medium' | 'low'
	domain?: string
	team?: string
	val: number
	color: string
	// Properties added by ForceGraph during rendering
	x?: number
	y?: number
	z?: number
}

interface GraphLink {
	id: string
	source: string | GraphNode
	target: string | GraphNode
	dependencyType: string
	color: string
}

interface ThreeDependencyGraphProps {
	customData?: ModelGraphData
	nodeSize?: number
}

export default function ThreeDependencyGraph({ customData, nodeSize = 3 }: ThreeDependencyGraphProps) {
	const graphRef = useRef<any>(null)
	const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null)
	const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] })

	// Transform model data to graph data format
	useEffect(() => {
		if (!customData) return

		// Transform model data to graph data
		const nodes = customData.nodes.map(node => {
			// Map risk to node color
			let color = '#4f46e5' // Default indigo
			switch (node.data.risk) {
				case 'high':
					color = '#ef4444' // Red
					break
				case 'medium':
					color = '#f97316' // Orange
					break
				case 'low':
					color = '#22c55e' // Green
					break
			}

			// Map node size based on risk (high risk = larger node)
			const size = node.data.risk === 'high' ? 1.5 : node.data.risk === 'medium' ? 1.2 : 1

			return {
				id: node.id,
				name: node.data.name,
				label: node.label,
				type: node.data.type,
				risk: node.data.risk,
				domain: node.data.domain,
				team: node.data.team,
				val: nodeSize * size, // Size of the node
				color
			}
		})

		// Transform edges to links
		const links = customData.edges.map(edge => ({
			id: edge.id,
			source: edge.source,
			target: edge.target,
			dependencyType: edge.data.dependencyType,
			color: '#aaaaaa'
		}))

		setGraphData({ nodes, links })
	}, [customData, nodeSize])

	// Custom node renderer using Three.js sphere
	const nodeThreeObject = useCallback((node: GraphNode) => {
		// Create sphere geometry for the node
		const radius = node.val
		const widthSegments = 16
		const heightSegments = 16
		const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments)
		const material = new THREE.MeshLambertMaterial({
			color: node.color,
			transparent: true,
			opacity: 0.8
		})
		const sphere = new THREE.Mesh(geometry, material)

		// Create a text sprite for the label
		const sprite = new THREE.Sprite(
			new THREE.SpriteMaterial({
				map: createTextTexture(node.label),
				sizeAttenuation: false
			})
		)

		sprite.scale.set(0.1, 0.05, 1)
		sprite.position.y = node.val + 0.5 // Position above the sphere

		// Group both sphere and label together
		const group = new THREE.Group()
		group.add(sphere)
		group.add(sprite)

		return group
	}, [])

	// Handle node click
	const handleNodeClick = useCallback((node: GraphNode) => {
		// Zoom to node and highlight it
		if (graphRef.current) {
			const graph = graphRef.current as any

			// Calculate a better camera position - slightly offset to better view the node
			const distance = 40 // Distance from node
			const offsetX = node.x ? node.x * 0.2 : 0 // Small offset for perspective
			const offsetY = node.y ? node.y * 0.1 : 0 // Small offset for perspective

			// Focus on the clicked node with better animation
			graph.cameraPosition(
				{
					x: (node.x || 0) + offsetX,
					y: (node.y || 0) + offsetY,
					z: (node.z || 0) + distance
				}, // New position
				node, // Look at this node
				1500 // Animation duration in ms (shorter for better responsiveness)
			)
		}

		// Set node as selected for details panel
		setSelectedNode(node)

		// Optional: Add sound feedback for click
		// if (typeof window !== 'undefined' && window.AudioContext) {
		//   const audioCtx = new AudioContext();
		//   const oscillator = audioCtx.createOscillator();
		//   oscillator.type = 'sine';
		//   oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // A4 note
		//   const gainNode = audioCtx.createGain();
		//   gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime); // 10% volume
		//   oscillator.connect(gainNode);
		//   gainNode.connect(audioCtx.destination);
		//   oscillator.start();
		//   oscillator.stop(audioCtx.currentTime + 0.1); // 0.1 second duration
		// }
	}, [])

	// Function to highlight links and nodes when a node is selected
	const handleLinkColor = useCallback(
		(link: GraphLink) => {
			if (selectedNode) {
				const sourceId = typeof link.source === 'object' ? link.source.id : link.source
				const targetId = typeof link.target === 'object' ? link.target.id : link.target

				return sourceId === selectedNode.id || targetId === selectedNode.id
					? '#3b82f6' // Highlight related links
					: '#dddddd99' // Fade out unrelated links
			}
			return link.color
		},
		[selectedNode]
	)

	const handleNodeColor = useCallback(
		(node: GraphNode) => {
			// If a node is selected, highlight it and its connections
			if (selectedNode) {
				// If this is the selected node
				if (node.id === selectedNode.id) {
					return node.color
				}

				// If this node is connected to the selected node
				const isConnected = graphData.links.some(link => {
					const sourceId = typeof link.source === 'object' ? link.source.id : link.source
					const targetId = typeof link.target === 'object' ? link.target.id : link.target

					return (
						(sourceId === selectedNode.id && targetId === node.id) ||
						(targetId === selectedNode.id && sourceId === node.id)
					)
				})

				return isConnected ? node.color : `${node.color}99` // Fade out unconnected nodes
			}
			return node.color
		},
		[selectedNode, graphData.links]
	)

	// Create text texture for node labels
	function createTextTexture(text: string): THREE.Texture {
		const canvas = document.createElement('canvas')
		const ctx = canvas.getContext('2d')
		canvas.width = 256
		canvas.height = 128

		if (ctx) {
			ctx.fillStyle = 'transparent'
			ctx.fillRect(0, 0, canvas.width, canvas.height)

			ctx.font = 'Bold 24px Inter, Arial, sans-serif'
			ctx.textAlign = 'center'
			ctx.textBaseline = 'middle'

			// Add background for better readability
			const textWidth = ctx.measureText(text).width + 16
			const textHeight = 32
			ctx.fillStyle = 'rgba(0,0,0,0.7)'
			ctx.fillRect(canvas.width / 2 - textWidth / 2, canvas.height / 2 - textHeight / 2, textWidth, textHeight)

			// Add text
			ctx.fillStyle = 'white'
			ctx.fillText(text, canvas.width / 2, canvas.height / 2)
		}

		const texture = new THREE.Texture(canvas)
		texture.needsUpdate = true
		return texture
	}

	// Get node relationships
	const getNodeRelationships = () => {
		if (!selectedNode || !graphData) return { inputs: [], outputs: [] }

		const inputs = graphData.links
			.filter(link => {
				const targetId = typeof link.target === 'object' ? link.target.id : link.target
				return targetId === selectedNode.id
			})
			.map(link => {
				const sourceId = typeof link.source === 'object' ? link.source.id : link.source
				const sourceNode = graphData.nodes.find(node => node.id === sourceId)
				return { link, node: sourceNode }
			})

		const outputs = graphData.links
			.filter(link => {
				const sourceId = typeof link.source === 'object' ? link.source.id : link.source
				return sourceId === selectedNode.id
			})
			.map(link => {
				const targetId = typeof link.target === 'object' ? link.target.id : link.target
				const targetNode = graphData.nodes.find(node => node.id === targetId)
				return { link, node: targetNode }
			})

		return { inputs, outputs }
	}

	const { inputs, outputs } = getNodeRelationships()

	return (
		<div className='w-full h-full flex flex-col'>
			<div className='flex-1 relative'>
				{graphData.nodes.length > 0 && (
					<ForceGraph3D
						ref={graphRef}
						graphData={graphData}
						nodeThreeObject={nodeThreeObject}
						nodeThreeObjectExtend={false}
						linkDirectionalArrowLength={3.5}
						linkDirectionalArrowRelPos={1}
						linkWidth={1}
						linkColor={handleLinkColor}
						nodeColor={handleNodeColor}
						onNodeClick={handleNodeClick}
						backgroundColor='#ffffff'
						nodeResolution={16} // Higher resolution spheres
						linkDirectionalParticles={2} // Animated particles on links
						linkDirectionalParticleSpeed={0.01}
						linkDirectionalParticleWidth={0.8}
						cooldownTime={5000} // Longer cooldown for smoother animation
						d3AlphaDecay={0.02} // Slower layout convergence for better animation
						d3VelocityDecay={0.4} // Slower layout convergence
						width={window.innerWidth}
						height={600} // Fixed height
					/>
				)}
			</div>
			{selectedNode && (
				<Card className='mt-4'>
					<CardHeader className='py-3'>
						<CardTitle>{selectedNode.name}</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='grid gap-4'>
							<div>
								<h3 className='text-sm font-medium'>Model Details</h3>
								<p className='text-sm text-muted-foreground'>ID: {selectedNode.id}</p>
								<p className='text-sm text-muted-foreground'>Type: {selectedNode.type}</p>
								<p className='text-sm text-muted-foreground'>Risk Level: {selectedNode.risk}</p>
								{selectedNode.domain && <p className='text-sm text-muted-foreground'>Domain: {selectedNode.domain}</p>}
								{selectedNode.team && <p className='text-sm text-muted-foreground'>Team: {selectedNode.team}</p>}
							</div>

							<div>
								<h3 className='text-sm font-medium'>Inputs</h3>
								{inputs.length > 0 ? (
									<ul className='text-sm'>
										{inputs.map(({ node, link }) => (
											<li key={link.id} className='mt-1'>
												From <span className='font-medium text-blue-500'>{node?.label || node?.name}</span>
												{link.dependencyType && <span className='text-muted-foreground'> - {link.dependencyType}</span>}
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
										{outputs.map(({ node, link }) => (
											<li key={link.id} className='mt-1'>
												To <span className='font-medium text-blue-500'>{node?.label || node?.name}</span>
												{link.dependencyType && <span className='text-muted-foreground'> - {link.dependencyType}</span>}
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
