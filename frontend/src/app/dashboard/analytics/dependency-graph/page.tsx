import DependencyGraph from '@/components/dependency-graph'
// import ModelExplorer from '@/components/model-explorer'
export default function DependencyGraphPage() {
	return (
		<div className='flex flex-col h-full p-4'>
			<DependencyGraph />
			{/* <ModelExplorer /> */}
		</div>
	)
}
