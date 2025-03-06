import ModelExplorer from "../model-explorer"
import DependencyGraph from "../dependency-graph"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ModelInventoryPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-2">Model Inventory Management</h1>
      <p className="text-muted-foreground mb-8">Review and explore model dependencies and relationships</p>

      <Tabs defaultValue="graph" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="graph">Dependency Graph</TabsTrigger>
          <TabsTrigger value="explorer">Model Explorer</TabsTrigger>
        </TabsList>

        <TabsContent value="graph">
          <DependencyGraph />
        </TabsContent>

        <TabsContent value="explorer">
          <ModelExplorer />
        </TabsContent>
      </Tabs>
    </div>
  )
}

