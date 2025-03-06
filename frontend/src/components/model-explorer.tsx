"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, ChevronRight, ChevronDown, Info, AlertCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Types for our model data
interface ModelUse {
  purpose: string
  use: string
  legalEntity: string
  assetClass?: string
}

interface ModelDependency {
  id: string
  name: string
  type: string
  relationship: "input" | "output" | "calculation"
}

interface Model {
  id: string
  name: string
  type: string
  purpose: string
  owner: string
  ownerInputter: string
  legalEntities: string[]
  uses: ModelUse[]
  dependencies: {
    dependsOn: ModelDependency[]
    dependedBy: ModelDependency[]
  }
  lastUpdated: string
  riskRating: "high" | "medium" | "low"
}

// Mock data for demonstration
const mockModels: Model[] = [
  {
    id: "MDL001",
    name: "Credit Risk Assessment",
    type: "Model",
    purpose: "Credit",
    owner: "Jane Smith",
    ownerInputter: "John Doe",
    legalEntities: ["LE1", "LE2"],
    uses: [
      { purpose: "Credit", use: "Capital", legalEntity: "LE1" },
      { purpose: "Credit", use: "Pricing", legalEntity: "LE2" },
    ],
    dependencies: {
      dependsOn: [],
      dependedBy: [
        { id: "MDL002", name: "Loan Pricing Model", type: "Model", relationship: "input" },
        { id: "MDL003", name: "Portfolio Risk Model", type: "Model", relationship: "input" },
      ],
    },
    lastUpdated: "2023-10-15",
    riskRating: "high",
  },
  {
    id: "MDL002",
    name: "Loan Pricing Model",
    type: "Model",
    purpose: "Credit",
    owner: "Robert Johnson",
    ownerInputter: "Sarah Williams",
    legalEntities: ["LE1"],
    uses: [{ purpose: "Credit", use: "Pricing", legalEntity: "LE1" }],
    dependencies: {
      dependsOn: [{ id: "MDL001", name: "Credit Risk Assessment", type: "Model", relationship: "input" }],
      dependedBy: [{ id: "MDL004", name: "Customer Offer Generator", type: "DQM in scope", relationship: "output" }],
    },
    lastUpdated: "2023-09-28",
    riskRating: "medium",
  },
  {
    id: "MDL003",
    name: "Portfolio Risk Model",
    type: "Model",
    purpose: "Market",
    owner: "Michael Brown",
    ownerInputter: "Emily Davis",
    legalEntities: ["LE1", "LE2"],
    uses: [
      { purpose: "Market", use: "Portfolio Management", legalEntity: "LE1" },
      { purpose: "Market", use: "Stress Testing", legalEntity: "LE2" },
    ],
    dependencies: {
      dependsOn: [{ id: "MDL001", name: "Credit Risk Assessment", type: "Model", relationship: "input" }],
      dependedBy: [],
    },
    lastUpdated: "2023-11-05",
    riskRating: "high",
  },
  {
    id: "MDL004",
    name: "Customer Offer Generator",
    type: "DQM in scope",
    purpose: "Credit",
    owner: "Lisa Anderson",
    ownerInputter: "David Wilson",
    legalEntities: ["LE1"],
    uses: [{ purpose: "Credit", use: "Pricing", legalEntity: "LE1" }],
    dependencies: {
      dependsOn: [{ id: "MDL002", name: "Loan Pricing Model", type: "Model", relationship: "input" }],
      dependedBy: [],
    },
    lastUpdated: "2023-10-20",
    riskRating: "low",
  },
]

export default function ModelExplorer() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedModel, setSelectedModel] = useState<Model | null>(null)
  const [expandedDependencies, setExpandedDependencies] = useState<{ [key: string]: boolean }>({})

  // Filter models based on search term
  const filteredModels = mockModels.filter(
    (model) =>
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.owner.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Toggle dependency expansion
  const toggleDependency = (id: string) => {
    setExpandedDependencies((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Render dependency tree
  const renderDependencyTree = (dependencies: ModelDependency[], type: "dependsOn" | "dependedBy") => {
    if (dependencies.length === 0) {
      return <div className="text-muted-foreground italic">No dependencies</div>
    }

    return (
      <div className="space-y-2">
        {dependencies.map((dep) => (
          <div key={dep.id} className="border rounded-md p-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => toggleDependency(dep.id)}>
                  {expandedDependencies[dep.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </Button>
                <span className="font-medium">{dep.name}</span>
                <Badge variant="outline">{dep.type}</Badge>
                <Badge
                  variant={
                    dep.relationship === "input"
                      ? "default"
                      : dep.relationship === "output"
                        ? "secondary"
                        : "destructive"
                  }
                  className="ml-2"
                >
                  {dep.relationship}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const model = mockModels.find((m) => m.id === dep.id)
                  if (model) setSelectedModel(model)
                }}
              >
                View Details
              </Button>
            </div>

            {expandedDependencies[dep.id] && (
              <div className="mt-2 pl-6 border-l-2 border-gray-200">
                {type === "dependsOn" ? (
                  <div className="text-sm text-muted-foreground">
                    This model provides {dep.relationship} data to {selectedModel?.name}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    {selectedModel?.name} provides {dep.relationship} data to this model
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Model Inventory Explorer</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left panel - Model list */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Models</CardTitle>
              <CardDescription>Browse all models in the inventory</CardDescription>
              <div className="relative mt-2">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search models..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-[600px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredModels.map((model) => (
                      <TableRow
                        key={model.id}
                        className={selectedModel?.id === model.id ? "bg-muted" : ""}
                        onClick={() => setSelectedModel(model)}
                      >
                        <TableCell>{model.id}</TableCell>
                        <TableCell>{model.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{model.type}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right panel - Model details */}
        <div className="md:col-span-2">
          {selectedModel ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{selectedModel.name}</CardTitle>
                    <CardDescription>ID: {selectedModel.id}</CardDescription>
                  </div>
                  <Badge
                    variant={
                      selectedModel.riskRating === "high"
                        ? "destructive"
                        : selectedModel.riskRating === "medium"
                          ? "default"
                          : "secondary"
                    }
                  >
                    {selectedModel.riskRating.toUpperCase()} RISK
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="details">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="uses">Uses</TabsTrigger>
                    <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Type</h3>
                        <p>{selectedModel.type}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Purpose</h3>
                        <p>{selectedModel.purpose}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Owner</h3>
                        <p>{selectedModel.owner}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Owner Inputter</h3>
                        <p>{selectedModel.ownerInputter}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Legal Entities</h3>
                        <div className="flex gap-1 mt-1">
                          {selectedModel.legalEntities.map((le) => (
                            <Badge key={le} variant="outline">
                              {le}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
                        <p>{selectedModel.lastUpdated}</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="uses">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Purpose</TableHead>
                          <TableHead>Use</TableHead>
                          <TableHead>Legal Entity</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedModel.uses.map((use, index) => (
                          <TableRow key={index}>
                            <TableCell>{use.purpose}</TableCell>
                            <TableCell>{use.use}</TableCell>
                            <TableCell>{use.legalEntity}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>

                  <TabsContent value="dependencies" className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                        <Info size={16} />
                        Depends On
                      </h3>
                      {renderDependencyTree(selectedModel.dependencies.dependsOn, "dependsOn")}
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                        <AlertCircle size={16} />
                        Depended By
                      </h3>
                      {renderDependencyTree(selectedModel.dependencies.dependedBy, "dependedBy")}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline" onClick={() => setSelectedModel(null)}>
                  Close
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
                <div className="mb-4 text-muted-foreground">
                  <Search size={48} />
                </div>
                <h3 className="text-xl font-medium mb-2">Select a Model</h3>
                <p className="text-muted-foreground">
                  Choose a model from the list to view detailed information and dependencies
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

