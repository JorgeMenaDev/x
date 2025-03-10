"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Types for our model data
interface ModelNode {
  id: string
  name: string
  type: string
  riskRating: "high" | "medium" | "low"
}

interface ModelEdge {
  source: string
  target: string
  relationship: "input" | "output" | "calculation"
}

interface ModelGraphData {
  nodes: ModelNode[]
  edges: ModelEdge[]
}

// Mock data for demonstration
const mockGraphData: ModelGraphData = {
  nodes: [
    { id: "MDL001", name: "Credit Risk Assessment", type: "Model", riskRating: "high" },
    { id: "MDL002", name: "Loan Pricing Model", type: "Model", riskRating: "medium" },
    { id: "MDL003", name: "Portfolio Risk Model", type: "Model", riskRating: "high" },
    { id: "MDL004", name: "Customer Offer Generator", type: "DQM in scope", riskRating: "low" },
    { id: "MDL005", name: "Market Risk Model", type: "Model", riskRating: "high" },
    { id: "MDL006", name: "Liquidity Risk Model", type: "Model", riskRating: "medium" },
    { id: "MDL007", name: "Stress Testing Model", type: "DQM in scope", riskRating: "high" },
  ],
  edges: [
    { source: "MDL001", target: "MDL002", relationship: "input" },
    { source: "MDL001", target: "MDL003", relationship: "input" },
    { source: "MDL002", target: "MDL004", relationship: "output" },
    { source: "MDL003", target: "MDL005", relationship: "input" },
    { source: "MDL005", target: "MDL006", relationship: "input" },
    { source: "MDL005", target: "MDL007", relationship: "input" },
    { source: "MDL006", target: "MDL007", relationship: "input" },
  ],
}

export default function DependencyGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Simple force-directed graph layout
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = 500 // Fixed height
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Node positions and physics
    const nodePositions: { [key: string]: { x: number; y: number; vx: number; vy: number } } = {}

    // Initialize random positions
    mockGraphData.nodes.forEach((node) => {
      nodePositions[node.id] = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: 0,
        vy: 0,
      }
    })

    // Colors based on risk rating
    const getRiskColor = (rating: string) => {
      switch (rating) {
        case "high":
          return "#ef4444"
        case "medium":
          return "#f97316"
        case "low":
          return "#22c55e"
        default:
          return "#3b82f6"
      }
    }

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Apply forces
      for (let i = 0; i < 10; i++) {
        // Multiple iterations for stability
        // Repulsive force between all nodes
        mockGraphData.nodes.forEach((node1) => {
          mockGraphData.nodes.forEach((node2) => {
            if (node1.id === node2.id) return

            const pos1 = nodePositions[node1.id]
            const pos2 = nodePositions[node2.id]

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
        mockGraphData.edges.forEach((edge) => {
          const pos1 = nodePositions[edge.source]
          const pos2 = nodePositions[edge.target]

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
      mockGraphData.nodes.forEach((node) => {
        const pos = nodePositions[node.id]

        // Apply velocity with damping
        pos.x += pos.vx * 0.1
        pos.y += pos.vy * 0.1
        pos.vx *= 0.9
        pos.vy *= 0.9

        // Contain within canvas
        if (pos.x < 50) pos.x = 50
        if (pos.x > canvas.width - 50) pos.x = canvas.width - 50
        if (pos.y < 50) pos.y = 50
        if (pos.y > canvas.height - 50) pos.y = canvas.height - 50
      })

      // Draw edges
      ctx.lineWidth = 1
      mockGraphData.edges.forEach((edge) => {
        const pos1 = nodePositions[edge.source]
        const pos2 = nodePositions[edge.target]

        ctx.beginPath()
        ctx.moveTo(pos1.x, pos1.y)
        ctx.lineTo(pos2.x, pos2.y)

        // Edge color based on relationship
        switch (edge.relationship) {
          case "input":
            ctx.strokeStyle = "#3b82f6" // Blue
            break
          case "output":
            ctx.strokeStyle = "#8b5cf6" // Purple
            break
          case "calculation":
            ctx.strokeStyle = "#f97316" // Orange
            break
          default:
            ctx.strokeStyle = "#9ca3af" // Gray
        }

        ctx.stroke()

        // Draw arrow
        const angle = Math.atan2(pos2.y - pos1.y, pos2.x - pos1.x)
        const arrowSize = 8

        ctx.beginPath()
        ctx.moveTo(
          pos2.x - arrowSize * Math.cos(angle - Math.PI / 6),
          pos2.y - arrowSize * Math.sin(angle - Math.PI / 6),
        )
        ctx.lineTo(pos2.x, pos2.y)
        ctx.lineTo(
          pos2.x - arrowSize * Math.cos(angle + Math.PI / 6),
          pos2.y - arrowSize * Math.sin(angle + Math.PI / 6),
        )
        ctx.fillStyle = ctx.strokeStyle
        ctx.fill()
      })

      // Draw nodes
      mockGraphData.nodes.forEach((node) => {
        const pos = nodePositions[node.id]

        // Node circle
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, 20, 0, Math.PI * 2)
        ctx.fillStyle = getRiskColor(node.riskRating)
        ctx.fill()

        // Node border
        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = 2
        ctx.stroke()

        // Node label
        ctx.fillStyle = "#ffffff"
        ctx.font = "10px Arial"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(node.id, pos.x, pos.y)

        // Node tooltip on hover
        const mouseX = 0 // Would need event listener
        const mouseY = 0 // Would need event listener
        const dx = mouseX - pos.x
        const dy = mouseY - pos.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 20) {
          // Would show tooltip
        }
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Model Dependency Graph</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm">High Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-sm">Medium Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm">Low Risk</span>
          </div>
        </div>
        <canvas ref={canvasRef} className="w-full border rounded-md" style={{ height: "500px" }} />
        <div className="mt-4 flex justify-end">
          <Button variant="outline">Export Graph</Button>
        </div>
      </CardContent>
    </Card>
  )
}

