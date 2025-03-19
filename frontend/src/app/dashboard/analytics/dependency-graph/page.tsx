import DependencyGraph from '@/components/dependency-graph'
import ModelRelationships from '@/features/model-relationships/components'

export default function DependencyGraphPage() {
	return (
		<div className='flex flex-col h-full p-4'>
			{/* <ModelRelationships /> */}
			<DependencyGraph />
		</div>
	)
}
