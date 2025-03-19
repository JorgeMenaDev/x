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

	// Use provided data or fallback to mock data
	const graphData = customData || mockGraphData
	const filteredNodes = graphData.nodes
	const filteredEdges = graphData.edges

	// Set up force simulation
	useEffect(() => {
		if (!canvasRef.current || !graphData.nodes.length) return

		const canvas = canvasRef.current
		const ctx = canvas.getContext('2d')
		if (!ctx) return

		// Calculate node positions (simplified)
		const positions: Record<string, { x: number; y: number }> = {}
		const width = canvas.width
		const height = canvas.height

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
		drawGraph(ctx)
	}, [graphData, nodeSize])

	// Redraw when selection changes
	useEffect(() => {
		const canvas = canvasRef.current
		if (!canvas) return
		const ctx = canvas.getContext('2d')
		if (!ctx) return

		drawGraph(ctx)
	}, [selectedNode, hoveredNode, mousePos])

	// Handle canvas resize
	useEffect(() => {
		const handleResize = () => {
			const canvas = canvasRef.current
			if (!canvas) return

			const parent = canvas.parentElement
			if (!parent) return

			canvas.width = parent.clientWidth
			canvas.height = parent.clientHeight

			const ctx = canvas.getContext('2d')
			if (ctx) drawGraph(ctx)
		}

		window.addEventListener('resize', handleResize)
		handleResize()

		return () => window.removeEventListener('resize', handleResize)
	}, [])

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
			for (const node of filteredNodes) {
				const pos = nodePositionsRef.current[node.id]
				if (!pos) continue

				const dx = x - pos.x
				const dy = y - pos.y
				const distance = Math.sqrt(dx * dx + dy * dy)

				if (distance < nodeSize) {
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
	}, [filteredNodes, nodeSize])

	// Draw the graph
	const drawGraph = useCallback(
		(ctx: CanvasRenderingContext2D) => {
			const canvas = ctx.canvas
			ctx.clearRect(0, 0, canvas.width, canvas.height)

			// Draw edges
			for (const edge of filteredEdges) {
				const sourcePos = nodePositionsRef.current[edge.source]
				const targetPos = nodePositionsRef.current[edge.target]

				if (!sourcePos || !targetPos) continue

				ctx.beginPath()
				ctx.moveTo(sourcePos.x, sourcePos.y)
				ctx.lineTo(targetPos.x, targetPos.y)
				ctx.strokeStyle = '#ccc'
				ctx.lineWidth = 1
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
				ctx.fillStyle = '#ccc'
				ctx.fill()
			}

			// Draw nodes
			for (const node of filteredNodes) {
				const pos = nodePositionsRef.current[node.id]
				if (!pos) continue

				// Determine if node is selected or hovered
				const isSelected = selectedNode?.id === node.id
				const isHovered = hoveredNode?.id === node.id

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

				// Add stroke for selected/hovered nodes
				if (isSelected || isHovered) {
					ctx.strokeStyle = isSelected ? '#ffffff' : '#d1d5db'
					ctx.lineWidth = isSelected ? 3 : 2
					ctx.stroke()
				}

				// Draw node label
				const fontSize = Math.max(12, nodeSize * 0.6)
				ctx.font = `${fontSize}px sans-serif`
				ctx.fillStyle = '#ffffff'
				ctx.textAlign = 'center'
				ctx.textBaseline = 'middle'
				ctx.fillText(node.label, pos.x, pos.y)
			}
		},
		[filteredNodes, filteredEdges, selectedNode, hoveredNode, nodeSize]
	)

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
					</CardContent>
				</Card>
			)}
		</div>
	)
}
