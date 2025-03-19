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

// Simple mock data for demonstration
const mockGraphData: ModelGraphData = {
	nodes: [
		{
			id: 'MDL001',
			label: 'Credit Risk',
			data: {
				name: 'Credit Risk Assessment',
				type: 'Model',
				risk: 'high',
				domain: 'Risk',
				team: 'Credit Risk Team'
			}
		},
		{
			id: 'MDL002',
			label: 'Market Risk',
			data: {
				name: 'Market Risk Assessment',
				type: 'Model',
				risk: 'medium',
				domain: 'Risk',
				team: 'Market Risk Team'
			}
		},
		{
			id: 'MDL003',
			label: 'Liquidity',
			data: {
				name: 'Liquidity Assessment',
				type: 'Model',
				risk: 'low',
				domain: 'Treasury',
				team: 'Treasury Team'
			}
		}
	],
	edges: [
		{
			id: 'E1',
			source: 'MDL001',
			target: 'MDL002',
			data: {
				dependencyType: 'input'
			}
		},
		{
			id: 'E2',
			source: 'MDL002',
			target: 'MDL003',
			data: {
				dependencyType: 'output'
			}
		}
	]
}

interface DependencyGraphProps {
	customData?: ModelGraphData
	nodeSize?: number
}

export default function DependencyGraph({ customData, nodeSize = 20 }: DependencyGraphProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const [selectedNode, setSelectedNode] = useState<ModelNode | null>(null)
	const [hoveredNode, setHoveredNode] = useState<ModelNode | null>(null)
	const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
	const nodePositionsRef = useRef<Record<string, { x: number; y: number }>>({})
	const [devicePixelRatio, setDevicePixelRatio] = useState(1)

	// Use provided data or fallback to mock data
	const graphData = customData || mockGraphData
	const filteredNodes = graphData.nodes
	const filteredEdges = graphData.edges

	// Initial render and whenever data changes
	useEffect(() => {
		if (!canvasRef.current || !graphData.nodes.length) return

		const dpr = window.devicePixelRatio || 1
		setDevicePixelRatio(dpr)

		const setupCanvas = () => {
			const canvas = canvasRef.current
			if (!canvas) return

			const ctx = canvas.getContext('2d', { alpha: false })
			if (!ctx) return

			// Get exact container dimensions
			const rect = canvas.getBoundingClientRect()

			// Set canvas dimensions accounting for pixel ratio
			canvas.width = rect.width * dpr
			canvas.height = rect.height * dpr

			// Scale canvas correctly
			ctx.scale(dpr, dpr)

			// Set display size via CSS
			canvas.style.width = `${rect.width}px`
			canvas.style.height = `${rect.height}px`

			// Enable anti-aliasing
			ctx.imageSmoothingEnabled = true
			ctx.imageSmoothingQuality = 'high'

			return { ctx, width: rect.width, height: rect.height }
		}

		const canvasSetup = setupCanvas()
		if (!canvasSetup) return

		const { ctx, width, height } = canvasSetup

		// Calculate node positions
		const positions: Record<string, { x: number; y: number }> = {}
		const centerX = width / 2
		const centerY = height / 2
		const radius = Math.min(width, height) * 0.35

		// Position nodes in a circle
		graphData.nodes.forEach((node, i) => {
			const angle = (i / graphData.nodes.length) * 2 * Math.PI
			positions[node.id] = {
				x: centerX + radius * Math.cos(angle),
				y: centerY + radius * Math.sin(angle)
			}
		})

		nodePositionsRef.current = positions

		// Draw the graph
		drawGraph(ctx, width, height)
	}, [graphData, nodeSize])

	// Handle canvas resize
	useEffect(() => {
		const handleResize = () => {
			if (!canvasRef.current) return

			const dpr = window.devicePixelRatio || 1
			setDevicePixelRatio(dpr)

			const canvas = canvasRef.current
			const parent = canvas.parentElement
			if (!parent) return

			// Set canvas dimensions
			const width = parent.clientWidth
			const height = parent.clientHeight

			canvas.width = width * dpr
			canvas.height = height * dpr

			// Scale canvas
			const ctx = canvas.getContext('2d')
			if (!ctx) return

			ctx.scale(dpr, dpr)

			// Set display size
			canvas.style.width = `${width}px`
			canvas.style.height = `${height}px`

			// Redraw
			drawGraph(ctx, width, height)
		}

		window.addEventListener('resize', handleResize)
		handleResize() // Initial resize

		return () => window.removeEventListener('resize', handleResize)
	}, [])

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
			setMousePos({ x, y })

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
					// Log the selected node for debugging
					console.log('Selected Node:', selectedNodeData)
				}
			} else {
				// If not clicking on a node, deselect
				setSelectedNode(null)
			}

			// Immediately redraw the graph to update visual state
			const ctx = canvas.getContext('2d')
			if (ctx) {
				drawGraph(ctx, canvas.width / devicePixelRatio, canvas.height / devicePixelRatio)
			}
		}

		canvas.addEventListener('mousemove', handleMouseMove)
		canvas.addEventListener('click', handleClick)

		return () => {
			canvas.removeEventListener('mousemove', handleMouseMove)
			canvas.removeEventListener('click', handleClick)
		}
	}, [filteredNodes, nodeSize])

	// Draw the graph
	const drawGraph = useCallback(
		(ctx: CanvasRenderingContext2D, width: number, height: number) => {
			// Clear with solid fill for better performance
			ctx.fillStyle = '#ffffff'
			ctx.fillRect(0, 0, width, height)

			// Make sure lines are sharp
			ctx.lineCap = 'round'
			ctx.lineJoin = 'round'

			// Draw edges
			for (const edge of filteredEdges) {
				const sourcePos = nodePositionsRef.current[edge.source]
				const targetPos = nodePositionsRef.current[edge.target]

				if (!sourcePos || !targetPos) continue

				// Check if edge is connected to selected node
				const isSelectedEdge = selectedNode && (selectedNode.id === edge.source || selectedNode.id === edge.target)

				ctx.beginPath()
				ctx.moveTo(sourcePos.x, sourcePos.y)
				ctx.lineTo(targetPos.x, targetPos.y)
				ctx.strokeStyle = isSelectedEdge ? '#3b82f6' : '#dddddd'
				ctx.lineWidth = isSelectedEdge ? 2 : 1
				ctx.stroke()

				// Draw arrow
				const dx = targetPos.x - sourcePos.x
				const dy = targetPos.y - sourcePos.y
				const angle = Math.atan2(dy, dx)

				const arrowLength = 10
				const arrowWidth = 5

				const arrowX = targetPos.x - Math.cos(angle) * nodeSize
				const arrowY = targetPos.y - Math.sin(angle) * nodeSize

				ctx.beginPath()
				ctx.moveTo(
					arrowX - Math.cos(angle - Math.PI / 6) * arrowLength,
					arrowY - Math.sin(angle - Math.PI / 6) * arrowLength
				)
				ctx.lineTo(arrowX, arrowY)
				ctx.lineTo(
					arrowX - Math.cos(angle + Math.PI / 6) * arrowLength,
					arrowY - Math.sin(angle + Math.PI / 6) * arrowLength
				)
				ctx.fillStyle = isSelectedEdge ? '#3b82f6' : '#dddddd'
				ctx.fill()
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

				// Draw node circle with crisp edges
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
					ctx.strokeStyle = isSelected ? '#ffffff' : isRelated ? '#3b82f6' : '#d1d5db'
					ctx.lineWidth = isSelected ? 3 : 2
					ctx.stroke()
				}

				// Draw node label with crisp text
				const fontSize = Math.max(12, nodeSize * 0.6)
				ctx.font = `${fontSize}px -apple-system, BlinkMacSystemFont, sans-serif`
				ctx.textAlign = 'center'
				ctx.textBaseline = 'middle'

				// Add text with shadow for better contrast
				if (isSelected || isHovered) {
					ctx.fillStyle = '#000000'
					ctx.globalAlpha = 0.3
					ctx.fillText(node.label, pos.x + 1, pos.y + 1)
					ctx.globalAlpha = 1.0
				}

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
		<div className='w-full h-full flex flex-col'>
			<div className='flex-1 relative'>
				<canvas ref={canvasRef} className='absolute inset-0 w-full h-full' />
			</div>
			{selectedNode && (
				<Card className='mt-4'>
					<CardContent className='p-4'>
						<h3 className='text-lg font-semibold'>{selectedNode.data.name}</h3>
						<div className='grid grid-cols-2 gap-2 mt-2 text-sm'>
							<div>
								<span className='font-medium'>Type:</span> {selectedNode.data.type}
							</div>
							<div>
								<span className='font-medium'>Risk:</span> {selectedNode.data.risk}
							</div>
							<div>
								<span className='font-medium'>Domain:</span> {selectedNode.data.domain || 'N/A'}
							</div>
							<div>
								<span className='font-medium'>Team:</span> {selectedNode.data.team || 'N/A'}
							</div>
						</div>

						{inputs.length > 0 && (
							<div className='mt-4'>
								<h4 className='font-medium'>Inputs</h4>
								<ul className='mt-1 space-y-1'>
									{inputs.map(({ node, edge }) => (
										<li key={edge.id}>
											From <span className='font-medium text-blue-500'>{node?.label}</span>
											{edge.data?.dependencyType && <span> - {edge.data.dependencyType}</span>}
										</li>
									))}
								</ul>
							</div>
						)}

						{outputs.length > 0 && (
							<div className='mt-4'>
								<h4 className='font-medium'>Outputs</h4>
								<ul className='mt-1 space-y-1'>
									{outputs.map(({ node, edge }) => (
										<li key={edge.id}>
											To <span className='font-medium text-blue-500'>{node?.label}</span>
											{edge.data?.dependencyType && <span> - {edge.data.dependencyType}</span>}
										</li>
									))}
								</ul>
							</div>
						)}
					</CardContent>
				</Card>
			)}
		</div>
	)
}
