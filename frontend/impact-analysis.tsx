"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"
import { Slider } from "@/components/ui/slider"

// Mock model data from our existing implementation
import { mockModels } from "./model-data"

export default function ImpactAnalysis() {
  const [selectedModelId, setSelectedModelId] = useState<string>("")
  const [impactLevel, setImpactLevel] = useState<number>(2) // Default to 2 levels deep
  const [impactType, setImpactType] = useState<string>("all")
  const [showResults, setShowResults] = useState<boolean>(false)

  // Calculate affected models based on dependencies
  const calculateImpact = () => {
    if (!selectedModelId) return []

    const affectedModels: any[] = []
    const visited = new Set<string>()

    const traverse = (modelId: string, level: number) => {
      if (visited.has(modelId) || level > impactLevel) return
      visited.add(modelId)

      const model = mockModels.find((m) => m.id === modelId)
      if (!model) return

      // For all models that depend on this model
      model.dependencies.dependedBy.forEach((dep) => {
        const dependentModel = mockModels.find((m) => m.id === dep.id)
        if (!dependentModel) return

        // Filter by impact type if needed
        if (impactType !== "all" && dep.relationship !== impactType) return

        affectedModels.push({
          ...dependentModel,
          impactLevel: level,
          relationship: dep.relationship,
        })

        // Continue traversing
        traverse(dep.id, level + 1)
      })
    }

    // Start traversal from selected model
    traverse(selectedModelId, 1)

    return affectedModels
  }

  const impactResults = calculateImpact()

  // Group results by impact level
  const groupedResults = impactResults.reduce(
    (acc, model) => {
      const level = model.impactLevel
      if (!acc[level]) acc[level] = []
      acc[level].push(model)
      return acc
    },
    {} as Record<number, any[]>,
  )

  // Calculate risk metrics
  const riskMetrics = {
    totalAffected: impactResults.length,
    highRiskCount: impactResults.filter((m) => m.riskRating === "high").length,
    criticalPathLength: Math.max(...impactResults.map((m) => m.impactLevel), 0),
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Impact Analysis</CardTitle>
        <CardDescription>Analyze the potential impact of changes to a model on dependent models</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Source Model</label>
              <Select value={selectedModelId} onValueChange={setSelectedModelId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  {mockModels.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name} ({model.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Impact Type</label>
              <Select value={impactType} onValueChange={setImpactType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select impact type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dependencies</SelectItem>
                  <SelectItem value="input">Input Dependencies</SelectItem>
                  <SelectItem value="output">Output Dependencies</SelectItem>
                  <SelectItem value="calculation">Calculation Dependencies</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium">Impact Depth (Levels)</label>
              <span className="text-sm">{impactLevel}</span>
            </div>
            <Slider
              value={[impactLevel]}
              min={1}
              max={5}
              step={1}
              onValueChange={(value) => setImpactLevel(value[0])}
            />
          </div>

          <Button onClick={() => setShowResults(true)} disabled={!selectedModelId}>
            Analyze Impact
          </Button>

          {showResults && selectedModelId && (
            <div className="mt-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{riskMetrics.totalAffected}</div>
                      <div className="text-sm text-muted-foreground">Affected Models</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{riskMetrics.highRiskCount}</div>
                      <div className="text-sm text-muted-foreground">High Risk Models</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{riskMetrics.criticalPathLength}</div>
                      <div className="text-sm text-muted-foreground">Max Dependency Depth</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {Object.keys(groupedResults).length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Impact Cascade</h3>

                  {Object.entries(groupedResults)
                    .sort(([levelA], [levelB]) => Number.parseInt(levelA) - Number.parseInt(levelB))
                    .map(([level, models]) => (
                      <div key={level} className="space-y-2">
                        <h4 className="text-sm font-medium flex items-center gap-2">
                          <Badge variant="outline">Level {level}</Badge>
                          {Number.parseInt(level) === 1 && (
                            <span className="text-xs text-muted-foreground">(Direct Dependencies)</span>
                          )}
                        </h4>

                        <div className="grid gap-2">
                          {models.map((model) => (
                            <div key={model.id} className="border rounded-md p-3 flex justify-between items-center">
                              <div>
                                <div className="font-medium">{model.name}</div>
                                <div className="text-sm text-muted-foreground">{model.id}</div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant={
                                    model.relationship === "input"
                                      ? "default"
                                      : model.relationship === "output"
                                        ? "secondary"
                                        : "outline"
                                  }
                                >
                                  {model.relationship}
                                </Badge>
                                <Badge
                                  variant={
                                    model.riskRating === "high"
                                      ? "destructive"
                                      : model.riskRating === "medium"
                                        ? "default"
                                        : "secondary"
                                  }
                                >
                                  {model.riskRating.toUpperCase()}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="flex items-center justify-center p-6 border rounded-md">
                  <div className="text-center">
                    <AlertTriangle className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <h3 className="font-medium">No Dependent Models Found</h3>
                    <p className="text-sm text-muted-foreground">
                      No models would be affected by changes to this model at the specified depth.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

