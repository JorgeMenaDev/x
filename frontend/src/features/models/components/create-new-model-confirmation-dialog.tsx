'use client'

import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConfirmationDialog } from '@/components/confirmation-dialog'
import { useCreateModel } from '../api/create-model'
import { type CreateModelPayload } from '../types'

type CreateNewModelConfirmationDialogProps = {
	onSuccess?: () => void
	formData: CreateModelPayload
}

export const CreateNewModelConfirmationDialog = ({ onSuccess, formData }: CreateNewModelConfirmationDialogProps) => {
	const createModelMutation = useCreateModel({
		mutationConfig: {
			onSuccess: () => {
				// Show success message
				alert('Success! Model has been successfully recorded.')
				onSuccess?.()
			},
			onError: error => {
				const errorMessage = error instanceof Error ? error.message : 'Something went wrong. Please try again.'
				alert(`Error: ${errorMessage}`)
			}
		}
	})

	return (
		<ConfirmationDialog
			icon='info'
			title='Record Model'
			body='Are you sure you want to record this model?'
			triggerButton={<Button type='submit'>Record Model</Button>}
			confirmButton={
				<Button
					type='button'
					disabled={createModelMutation.isPending}
					onClick={() => createModelMutation.mutate(formData)}
				>
					{createModelMutation.isPending ? (
						<>
							<Loader2 className='mr-2 h-4 w-4 animate-spin' />
							Recording...
						</>
					) : (
						'Record Model'
					)}
				</Button>
			}
			isDone={createModelMutation.isSuccess}
		/>
	)
}
