import NewModelForm from '@/components/new-model-form'

export default function NewModelPage() {
	return (
		<main className='min-h-screen p-8'>
			<div className='mb-8'>
				<h1 className='text-3xl font-bold mb-2'>Models with multiple uses</h1>
				<p className='text-muted-foreground'>Record a model in the inventory with multiple uses</p>
			</div>
			<NewModelForm />
		</main>
	)
}
