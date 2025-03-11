'use client'

import { useState } from 'react'
import { Loader2, Code, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConfirmationDialog } from '@/components/confirmation-dialog'
import { useCreateModel } from '../api/create-model'
import { type CreateModelPayload } from '../types'
import { Badge } from '@/components/ui/badge'

type CreateNewModelConfirmationDialogProps = {
	onSuccess?: () => void
	formData: CreateModelPayload
}

export const CreateNewModelConfirmationDialog = ({ onSuccess, formData }: CreateNewModelConfirmationDialogProps) => {
	const [showJson, setShowJson] = useState(false)

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

	// Format JSON with indentation for better readability
	const formattedJson = JSON.stringify(formData, null, 2)

	return (
		<ConfirmationDialog
			icon='info'
			title='Record Model'
			body={
				<div className='space-y-4'>
					<p>Are you sure you want to record this model?</p>

					<div className='mt-4'>
						<div
							className='flex items-center cursor-pointer text-sm text-gray-600 hover:text-gray-900 transition-colors'
							onClick={() => setShowJson(!showJson)}
						>
							<Button variant='ghost' size='sm' className='p-0 h-auto font-normal'>
								{showJson ? <ChevronUp className='h-4 w-4 mr-1' /> : <ChevronDown className='h-4 w-4 mr-1' />}
								{showJson ? 'Hide' : 'Show'} submission data
							</Button>
							<Badge variant='outline' className='ml-2 bg-gray-100 text-gray-700'>
								<Code className='h-3 w-3 mr-1' />
								Technical
							</Badge>
						</div>

						{showJson && (
							<div className='mt-2 relative'>
								<pre className='text-xs bg-gray-50 p-3 rounded-md border overflow-auto max-h-60 text-left'>
									<code>{formattedJson}</code>
								</pre>
							</div>
						)}
					</div>
				</div>
			}
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
