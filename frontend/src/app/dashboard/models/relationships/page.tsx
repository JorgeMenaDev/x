import OrgChart from '@/features/model-relationships/components'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import DefaultDependencyGraph from '@/components/dependency-graph/default-depdendency-graph'

export default function DependencyGraphPage() {
	return (
		<div className='flex flex-col h-full p-4'>
			<Tabs defaultValue='model-relationships' className='w-full'>
				<TabsList className='grid w-full grid-cols-2 mb-4'>
					<TabsTrigger value='model-relationships'>Org Chart</TabsTrigger>
					<TabsTrigger value='model-graph'>2D Graph</TabsTrigger>
				</TabsList>
				<TabsContent value='model-relationships'>
					<OrgChart />
				</TabsContent>

				<TabsContent value='model-graph'>
					<DefaultDependencyGraph />
				</TabsContent>
			</Tabs>
		</div>
	)
}
