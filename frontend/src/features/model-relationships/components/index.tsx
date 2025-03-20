'use client'

import ModelRelationshipGraph from './ModelRelationshipGraph'

export default function ModelRelationships() {
	return (
		<div className='container mx-auto p-4 pb-20 max-w-full '>
			<div className='mb-6'>
				<h1 className='text-3xl font-bold mb-2'>Model Relationships</h1>
				<p className='text-muted-foreground'>Manage and visualize relationships between models in the inventory</p>
			</div>

			<ModelRelationshipGraph />
		</div>
	)
}
