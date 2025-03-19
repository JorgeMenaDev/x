'use client'

import ModelDataAdapter from '@/components/dependency-graph/model-adapter'

export default function ModelRelationshipsPage() {
	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-2xl font-bold mb-6'>Model Relationships</h1>
			<ModelDataAdapter />
		</div>
	)
}
