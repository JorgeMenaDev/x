'use client'

import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ModelRelationshipForm from './ModelRelationshipForm'
import ModelRelationshipGraph from './ModelRelationshipGraph'
import { useModelGraph } from '../api/get-model-graph'

export default function ModelRelationships() {
	const [activeTab, setActiveTab] = useState<string>('visualize')
	const { refetch } = useModelGraph()

	const handleRelationshipCreated = () => {
		// Refetch the graph data when a relationship is created
		refetch()
	}

	return (
		<div className='container mx-auto p-4 max-w-7xl'>
			<div className='mb-8'>
				<h1 className='text-3xl font-bold mb-2'>Model Relationships</h1>
				<p className='text-muted-foreground'>Manage and visualize relationships between models in the inventory</p>
			</div>

			<Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
				<TabsList className='grid w-full grid-cols-2 mb-8'>
					<TabsTrigger value='visualize'>Visualize Relationships</TabsTrigger>
					<TabsTrigger value='manage'>Manage Relationships</TabsTrigger>
				</TabsList>

				<TabsContent value='visualize' className='mt-0'>
					<ModelRelationshipGraph />
				</TabsContent>

				<TabsContent value='manage' className='mt-0'>
					<ModelRelationshipForm onRelationshipCreated={handleRelationshipCreated} />
				</TabsContent>
			</Tabs>
		</div>
	)
}
