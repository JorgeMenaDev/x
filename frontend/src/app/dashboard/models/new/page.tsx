import ModelReferenceForm from '@/components/model-reference-form'
import modelReferenceData from '@/schemas/modelReferenceData.json'

export default function NewModelPage() {
	return (
		<main className='min-h-screen p-8'>
			<div className='mb-8'>
				<h1 className='text-3xl font-bold mb-2'>Models with multiple uses</h1>
				<p className='text-muted-foreground'>Record a model in the inventory with multiple uses</p>
			</div>

			<ModelReferenceForm modelReferenceData={modelReferenceData} />
		</main>
	)
}
