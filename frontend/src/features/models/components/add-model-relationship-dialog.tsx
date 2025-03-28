import * as React from 'react'
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription } from '@/components/ui/dialog'
import ModelRelationshipForm from '@/features/model-relationships/components/ModelRelationshipForm'

interface AddModelRelationshipDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	modelId?: string
	modelData?: any
}

export function AddModelRelationshipDialog({
	open,
	onOpenChange,
	modelId,
	modelData
}: AddModelRelationshipDialogProps) {
	// Get model name directly from the model data
	const modelName = modelData?.name || modelData?.modelName || modelData?.model_name || 'Selected model'

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='max-w-[800px] w-[90vw]'>
				<DialogHeader>
					<DialogTitle>Add Model Relationship</DialogTitle>
					<DialogDescription>{`Define a relationship starting from "${modelName}"`}</DialogDescription>
				</DialogHeader>
				<ModelRelationshipForm
					initialSourceModelId={modelId}
					sourceModelName={modelName}
					onRelationshipCreated={() => {
						onOpenChange(false)
					}}
				/>
			</DialogContent>
		</Dialog>
	)
}
