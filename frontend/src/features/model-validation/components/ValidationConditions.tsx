'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { AlertTriangle } from 'lucide-react'

interface ModelUse {
	id: string
	name: string
	legalEntity: string
	assetClass: string
	subGroup: string
}

interface ValidationConditionsProps {
	modelUses: ModelUse[]
	conditions: Record<string, string>
	onConditionChange: (useId: string, condition: string) => void
	readOnly?: boolean
}

/**
 * Component for specifying conditions for each model use when a validation is approved with conditions.
 * This component is used within the ValidationRecord component.
 */
export const ValidationConditions: React.FC<ValidationConditionsProps> = ({
	modelUses,
	conditions,
	onConditionChange,
	readOnly = false
}) => {
	if (!modelUses || modelUses.length === 0) {
		return (
			<div className='text-center p-6 text-muted-foreground'>
				<AlertTriangle className='mx-auto h-8 w-8 text-yellow-500 mb-2' />
				<h3 className='text-lg font-medium mb-1'>No Model Uses Found</h3>
				<p>There are no model uses to apply conditions to.</p>
			</div>
		)
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Model Use Conditions</CardTitle>
				<CardDescription>
					{readOnly ? 'Review the conditions applied to each model use' : 'Specify conditions for each model use'}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='space-y-6'>
					{modelUses.map(use => (
						<div key={use.id} className='border rounded-md p-4'>
							<div className='flex justify-between items-start mb-4'>
								<div>
									<h3 className='font-medium'>{use.name}</h3>
									<p className='text-sm text-muted-foreground'>
										{use.legalEntity} • {use.assetClass} • {use.subGroup}
									</p>
								</div>
							</div>

							<div className='space-y-2'>
								<Label htmlFor={`condition-${use.id}`}>
									{readOnly ? 'Conditions for this use:' : 'Specify conditions for this use:'}
								</Label>
								<Textarea
									id={`condition-${use.id}`}
									value={conditions[use.id] || ''}
									onChange={e => !readOnly && onConditionChange(use.id, e.target.value)}
									placeholder={
										readOnly ? 'No conditions specified' : 'Specify any conditions or limitations for this model use'
									}
									rows={3}
									readOnly={readOnly}
									className={readOnly ? 'bg-muted' : ''}
								/>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	)
}
