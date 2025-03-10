"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, AlertTriangle, XCircle, Calendar, FileText, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

// Mock lifecycle data
const lifecycleStages = [
  { id: "development", name: "Development", status: "completed", date: "2023-05-15", owner: "John Smith" },
  { id: "validation", name: "Validation", status: "completed", date: "2023-07-22", owner: "Maria Garcia" },
  { id: "approval", name: "Approval", status: "completed", date: "2023-08-10", owner: "Robert Chen" },
  { id: "implementation", name: "Implementation", status: "in-progress", date: "2023-10-05", owner: "Sarah Johnson" },
  { id: "monitoring", name: "Monitoring", status: "pending", date: null, owner: "David Wilson" },
  { id: "review", name: "Annual Review", status: "pending", date: null, owner: "Lisa Anderson" },
]

const modelVersions = [
  {
    version: "3.0",
    status: "in-progress",
    date: "2023-10-05",
    changes: "Major update to incorporate new regulatory requirements",
  },
  { version: "2.1", status: "approved", date: "2023-02-15", changes: "Minor fixes to calculation methodology" },
  { version: "2.0", status: "archived", date: "2022-08-22", changes: "Updated risk factors and improved accuracy" },
  { version: "1.0", status: "archived", date: "2021-11-10", changes: "Initial model implementation" },
]

const validationResults = [
  {
    id: "val-001",
    date: "2023-07-22",
    validator: "Maria Garcia",
    status: "passed",
    findings: [
      { severity: "low", description: "Documentation could be improved for clarity" },
      { severity: "info", description: "Consider additional test cases for edge scenarios" },
    ],
  },
  {
    id: "val-002",
    date: "2022-07-15",
    validator: "Maria Garcia",
    status: "passed-with-conditions",
    findings: [
      { severity: "medium", description: "Sensitivity analysis shows potential issues with extreme market conditions" },
      { severity: "low", description: "Model documentation needs updating" },
    ],
  },
  {
    id: "val-003",
    date: "2021-11-05",
    validator: "Thomas Wright",
    status: "failed",
    findings: [
      { severity: "high", description: "Backtesting shows significant deviation from expected results" },
      { severity: "medium", description: "Input data quality issues identified" },
    ],
  },
]

const performanceMetrics = [
  { period: "Q3 2023", accuracy: 92, stability: 88, efficiency: 76 },
  { period: "Q2 2023", accuracy: 91, stability: 85, efficiency: 75 },
  { period: "Q1 2023", accuracy: 89, stability: 87, efficiency: 72 },
  { period: "Q4 2022", accuracy: 86, stability: 82, efficiency: 70 },
]

export default function ModelLifecycle() {
  const [selectedVersion, setSelectedVersion] = useState(modelVersions[0].version)

  // Calculate lifecycle progress
  const completedStages = lifecycleStages.filter((stage) => stage.status === "completed").length
  const totalStages = lifecycleStages.length
  const progressPercentage = Math.round((completedStages / totalStages) * 100)

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-500">
            <CheckCircle2 className="mr-1 h-3 w-3" /> Completed
          </Badge>
        )
      case "in-progress":
        return (
          <Badge className="bg-blue-500">
            <Clock className="mr-1 h-3 w-3" /> In Progress
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline">
            <Clock className="mr-1 h-3 w-3" /> Pending
          </Badge>
        )
      case "approved":
        return (
          <Badge className="bg-green-500">
            <CheckCircle2 className="mr-1 h-3 w-3" /> Approved
          </Badge>
        )
      case "archived":
        return (
          <Badge variant="secondary">
            <FileText className="mr-1 h-3 w-3" /> Archived
          </Badge>
        )
      case "passed":
        return (
          <Badge className="bg-green-500">
            <CheckCircle2 className="mr-1 h-3 w-3" /> Passed
          </Badge>
        )
      case "passed-with-conditions":
        return (
          <Badge className="bg-yellow-500">
            <AlertTriangle className="mr-1 h-3 w-3" /> Passed with Conditions
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" /> Failed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Get severity badge
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return <Badge variant="destructive">High</Badge>
      case "medium":
        return <Badge className="bg-yellow-500">Medium</Badge>
      case "low":
        return <Badge variant="outline">Low</Badge>
      case "info":
        return <Badge variant="secondary">Info</Badge>
      default:
        return <Badge variant="outline">{severity}</Badge>
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Model Lifecycle Management</CardTitle>
        <CardDescription>Track the complete lifecycle of your model from development to retirement</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="stages">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="stages">Lifecycle Stages</TabsTrigger>
            <TabsTrigger value="versions">Version History</TabsTrigger>
            <TabsTrigger value="validation">Validation Results</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="stages" className="space-y-4">
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium">Lifecycle Progress</div>
                <div className="text-sm text-muted-foreground">{progressPercentage}% Complete</div>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>

            <div className="relative mt-8 pl-6 border-l-2 border-muted space-y-8">
              {lifecycleStages.map((stage, index) => (
                <div key={stage.id} className="relative">
                  {/* Timeline dot */}
                  <div
                    className={`absolute w-4 h-4 rounded-full -left-8 top-0 ${
                      stage.status === "completed"
                        ? "bg-green-500"
                        : stage.status === "in-progress"
                          ? "bg-blue-500"
                          : "bg-muted"
                    }`}
                  ></div>

                  <div className="grid gap-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{stage.name}</h3>
                      {getStatusBadge(stage.status)}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {stage.date || "Not scheduled"}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="h-4 w-4" />
                        {stage.owner}
                      </div>
                    </div>

                    {stage.status === "in-progress" && (
                      <div className="mt-2 flex gap-2">
                        <Button size="sm">Update Status</Button>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="versions" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              {modelVersions.map((version) => (
                <Card
                  key={version.version}
                  className={`cursor-pointer ${selectedVersion === version.version ? "border-primary" : ""}`}
                  onClick={() => setSelectedVersion(version.version)}
                >
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-xl font-bold mb-1">v{version.version}</div>
                      <div className="mb-2">{getStatusBadge(version.status)}</div>
                      <div className="text-xs text-muted-foreground">{version.date}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Version {selectedVersion} Details</h3>

              {modelVersions.find((v) => v.version === selectedVersion) && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Changes</h4>
                    <p>{modelVersions.find((v) => v.version === selectedVersion)?.changes}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button>View Documentation</Button>
                    <Button variant="outline">Compare Versions</Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="validation" className="space-y-6 mt-4">
            {validationResults.map((validation) => (
              <Card key={validation.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-medium">Validation #{validation.id}</h3>
                      <div className="text-sm text-muted-foreground">{validation.date}</div>
                    </div>
                    {getStatusBadge(validation.status)}
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Validator</h4>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{validation.validator}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Findings</h4>
                    <div className="space-y-2">
                      {validation.findings.map((finding, idx) => (
                        <div key={idx} className="flex items-start gap-2 p-2 border rounded-md">
                          {getSeverityBadge(finding.severity)}
                          <span>{finding.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Button variant="outline" size="sm">
                      View Full Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="performance" className="mt-4">
            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {["Accuracy", "Stability", "Efficiency"].map((metric) => (
                  <Card key={metric}>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <h3 className="text-lg font-medium mb-2">{metric}</h3>
                        <div className="text-3xl font-bold">{performanceMetrics[0][metric.toLowerCase()]}%</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {performanceMetrics[0][metric.toLowerCase()] > performanceMetrics[1][metric.toLowerCase()]
                            ? `↑ ${performanceMetrics[0][metric.toLowerCase()] - performanceMetrics[1][metric.toLowerCase()]}%`
                            : `↓ ${performanceMetrics[1][metric.toLowerCase()] - performanceMetrics[0][metric.toLowerCase()]}%`}
                          from previous period
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-end justify-between gap-2">
                    {performanceMetrics.map((metric, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-2">
                        <div className="flex gap-1">
                          <div
                            className="w-8 bg-blue-500 rounded-t-sm"
                            style={{ height: `${metric.accuracy * 2}px` }}
                          ></div>
                          <div
                            className="w-8 bg-green-500 rounded-t-sm"
                            style={{ height: `${metric.stability * 2}px` }}
                          ></div>
                          <div
                            className="w-8 bg-orange-500 rounded-t-sm"
                            style={{ height: `${metric.efficiency * 2}px` }}
                          ></div>
                        </div>
                        <div className="text-xs text-muted-foreground">{metric.period}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                      <span className="text-sm">Accuracy</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                      <span className="text-sm">Stability</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-sm"></div>
                      <span className="text-sm">Efficiency</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

