import ModelRelationships from '@/features/model-relationships/components'
import ModelDataAdapter from '@/components/dependency-graph/model-adapter'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function DependencyGraphPage() {
	return (
		<div className='flex flex-col h-full p-4'>
			<Tabs defaultValue='model-relationships' className='w-full'>
				<TabsList className='grid w-full grid-cols-2 mb-4'>
					<TabsTrigger value='model-relationships'>Org Chart</TabsTrigger>
					<TabsTrigger value='model-graph'>2D & 3D Graphs</TabsTrigger>
				</TabsList>
				<TabsContent value='model-relationships'>
					<ModelRelationships />
				</TabsContent>

				<TabsContent value='model-graph'>
					<ModelDataAdapter />
				</TabsContent>
			</Tabs>
		</div>
	)
}
