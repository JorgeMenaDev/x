'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, ChevronRight, ChevronDown, Info, AlertCircle } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ModelExplorer } from '@/features/model-explorer/model-explorer'
import { useSearchParams } from 'next/navigation'

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
	relationship: 'input' | 'output' | 'calculation'
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
	riskRating: 'high' | 'medium' | 'low'
}

// Mock data for demonstration
const mockModels: Model[] = [
	{
		id: 'MDL001',
		name: 'Credit Risk Assessment',
		type: 'Model',
		purpose: 'Credit',
		owner: 'Jane Smith',
		ownerInputter: 'John Doe',
		legalEntities: ['LE1', 'LE2'],
		uses: [
			{ purpose: 'Credit', use: 'Capital', legalEntity: 'LE1' },
			{ purpose: 'Credit', use: 'Pricing', legalEntity: 'LE2' }
		],
		dependencies: {
			dependsOn: [],
			dependedBy: [
				{ id: 'MDL002', name: 'Loan Pricing Model', type: 'Model', relationship: 'input' },
				{ id: 'MDL003', name: 'Portfolio Risk Model', type: 'Model', relationship: 'input' }
			]
		},
		lastUpdated: '2023-10-15',
		riskRating: 'high'
	},
	{
		id: 'MDL002',
		name: 'Loan Pricing Model',
		type: 'Model',
		purpose: 'Credit',
		owner: 'Robert Johnson',
		ownerInputter: 'Sarah Williams',
		legalEntities: ['LE1'],
		uses: [{ purpose: 'Credit', use: 'Pricing', legalEntity: 'LE1' }],
		dependencies: {
			dependsOn: [{ id: 'MDL001', name: 'Credit Risk Assessment', type: 'Model', relationship: 'input' }],
			dependedBy: [{ id: 'MDL004', name: 'Customer Offer Generator', type: 'DQM in scope', relationship: 'output' }]
		},
		lastUpdated: '2023-09-28',
		riskRating: 'medium'
	},
	{
		id: 'MDL003',
		name: 'Portfolio Risk Model',
		type: 'Model',
		purpose: 'Market',
		owner: 'Michael Brown',
		ownerInputter: 'Emily Davis',
		legalEntities: ['LE1', 'LE2'],
		uses: [
			{ purpose: 'Market', use: 'Portfolio Management', legalEntity: 'LE1' },
			{ purpose: 'Market', use: 'Stress Testing', legalEntity: 'LE2' }
		],
		dependencies: {
			dependsOn: [{ id: 'MDL001', name: 'Credit Risk Assessment', type: 'Model', relationship: 'input' }],
			dependedBy: []
		},
		lastUpdated: '2023-11-05',
		riskRating: 'high'
	},
	{
		id: 'MDL004',
		name: 'Customer Offer Generator',
		type: 'DQM in scope',
		purpose: 'Credit',
		owner: 'Lisa Anderson',
		ownerInputter: 'David Wilson',
		legalEntities: ['LE1'],
		uses: [{ purpose: 'Credit', use: 'Pricing', legalEntity: 'LE1' }],
		dependencies: {
			dependsOn: [{ id: 'MDL002', name: 'Loan Pricing Model', type: 'Model', relationship: 'input' }],
			dependedBy: []
		},
		lastUpdated: '2023-10-20',
		riskRating: 'low'
	}
]

export default function ModelExplorerWrapper() {
	const searchParams = useSearchParams()

	// Convert searchParams to an object
	const paramsObject = {} as { [key: string]: string | string[] | undefined }
	searchParams.forEach((value, key) => {
		paramsObject[key] = value
	})

	return <ModelExplorer searchParams={Promise.resolve(paramsObject)} />
}
