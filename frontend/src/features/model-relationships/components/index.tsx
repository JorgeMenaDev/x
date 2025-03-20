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
		<div className='container mx-auto p-4 pb-20 max-w-full h-full'>
			<div className='mb-6'>
				<h1 className='text-3xl font-bold mb-2'>Model Relationships</h1>
				<p className='text-muted-foreground'>Manage and visualize relationships between models in the inventory</p>
			</div>

			<Tabs value={activeTab} onValueChange={setActiveTab} className='w-full h-[calc(100vh-220px)] flex flex-col'>
				<TabsList className='grid w-full grid-cols-2 mb-4'>
					<TabsTrigger value='visualize'>Visualize Relationships</TabsTrigger>
					<TabsTrigger value='manage'>Manage Relationships</TabsTrigger>
				</TabsList>

				<TabsContent value='visualize' className='mt-0 flex-1 h-full overflow-y-auto'>
					<ModelRelationshipGraph />
				</TabsContent>

				<TabsContent value='manage' className='mt-0 h-full overflow-y-auto'>
					<ModelRelationshipForm onRelationshipCreated={handleRelationshipCreated} />
				</TabsContent>
			</Tabs>
		</div>
	)
}
