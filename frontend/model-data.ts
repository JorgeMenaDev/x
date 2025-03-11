export interface ModelUse {
  purpose: string
  use: string
  legalEntity: string
  assetClass?: string
}

export interface ModelDependency {
  id: string
  name: string
  type: string
  relationship: "input" | "output" | "calculation"
}

export interface Model {
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
export const mockModels: Model[] = [
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
      dependedBy: [{ id: "MDL005", name: "Market Risk Model", type: "Model", relationship: "input" }],
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
  {
    id: "MDL005",
    name: "Market Risk Model",
    type: "Model",
    purpose: "Market",
    owner: "Thomas Clark",
    ownerInputter: "Jennifer Lee",
    legalEntities: ["LE2"],
    uses: [{ purpose: "Market", use: "Capital", legalEntity: "LE2" }],
    dependencies: {
      dependsOn: [{ id: "MDL003", name: "Portfolio Risk Model", type: "Model", relationship: "input" }],
      dependedBy: [
        { id: "MDL006", name: "Liquidity Risk Model", type: "Model", relationship: "calculation" },
        { id: "MDL007", name: "Stress Testing Model", type: "DQM in scope", relationship: "input" },
      ],
    },
    lastUpdated: "2023-11-10",
    riskRating: "high",
  },
  {
    id: "MDL006",
    name: "Liquidity Risk Model",
    type: "Model",
    purpose: "Market",
    owner: "Richard Taylor",
    ownerInputter: "Amanda White",
    legalEntities: ["LE1", "LE2"],
    uses: [
      { purpose: "Market", use: "Liquidity Management", legalEntity: "LE1" },
      { purpose: "Market", use: "Liquidity Management", legalEntity: "LE2" },
    ],
    dependencies: {
      dependsOn: [{ id: "MDL005", name: "Market Risk Model", type: "Model", relationship: "calculation" }],
      dependedBy: [{ id: "MDL007", name: "Stress Testing Model", type: "DQM in scope", relationship: "input" }],
    },
    lastUpdated: "2023-11-15",
    riskRating: "medium",
  },
  {
    id: "MDL007",
    name: "Stress Testing Model",
    type: "DQM in scope",
    purpose: "Operational",
    owner: "Daniel Martin",
    ownerInputter: "Michelle Robinson",
    legalEntities: ["LE1", "LE2"],
    uses: [
      { purpose: "Operational", use: "Stress Testing", legalEntity: "LE1" },
      { purpose: "Operational", use: "Stress Testing", legalEntity: "LE2" },
    ],
    dependencies: {
      dependsOn: [
        { id: "MDL005", name: "Market Risk Model", type: "Model", relationship: "input" },
        { id: "MDL006", name: "Liquidity Risk Model", type: "Model", relationship: "input" },
      ],
      dependedBy: [],
    },
    lastUpdated: "2023-11-20",
    riskRating: "high",
  },
]

