import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Types for the component props
interface ModelDetailsCardProps {
	selectedNode: {
		name: string
		id: string
		type: string
		risk: 'high' | 'medium' | 'low'
		domain?: string
		team?: string
	}
	inputs: Array<{
		node?: {
			label?: string
			name?: string
		}
		link: {
			id: string
			dependencyType?: string
		}
	}>
	outputs: Array<{
		node?: {
			label?: string
			name?: string
		}
		link: {
			id: string
			dependencyType?: string
		}
	}>
}

export default function ModelDetailsCard({ selectedNode, inputs, outputs }: ModelDetailsCardProps) {
	return (
		<Card className='mt-4'>
			<CardHeader className='py-3'>
				<CardTitle>{selectedNode.name}</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='grid gap-4'>
					<div>
						<h3 className='text-sm font-medium'>Model Details</h3>
						<p className='text-sm text-muted-foreground'>ID: {selectedNode.id}</p>
						<p className='text-sm text-muted-foreground'>Type: {selectedNode.type}</p>
						<p className='text-sm text-muted-foreground'>Risk Level: {selectedNode.risk}</p>
						{selectedNode.domain && <p className='text-sm text-muted-foreground'>Domain: {selectedNode.domain}</p>}
						{selectedNode.team && <p className='text-sm text-muted-foreground'>Team: {selectedNode.team}</p>}
					</div>

					<div>
						<h3 className='text-sm font-medium'>Inputs</h3>
						{inputs.length > 0 ? (
							<ul className='text-sm'>
								{inputs.map(({ node, link }) => (
									<li key={link.id} className='mt-1'>
										From <span className='font-medium text-blue-500'>{node?.label || node?.name}</span>
										{link.dependencyType && <span className='text-muted-foreground'> - {link.dependencyType}</span>}
									</li>
								))}
							</ul>
						) : (
							<p className='text-sm text-muted-foreground'>No inputs</p>
						)}
					</div>

					<div>
						<h3 className='text-sm font-medium'>Outputs</h3>
						{outputs.length > 0 ? (
							<ul className='text-sm'>
								{outputs.map(({ node, link }) => (
									<li key={link.id} className='mt-1'>
										To <span className='font-medium text-blue-500'>{node?.label || node?.name}</span>
										{link.dependencyType && <span className='text-muted-foreground'> - {link.dependencyType}</span>}
									</li>
								))}
							</ul>
						) : (
							<p className='text-sm text-muted-foreground'>No outputs</p>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
