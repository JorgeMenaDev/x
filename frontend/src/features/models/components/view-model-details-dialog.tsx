import * as React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { useSeparateModelReferenceData } from '../hooks/use-model-reference-data'
import { Skeleton } from '@/components/ui/skeleton'

interface ViewModelDetailsDialogProps {
	modelData: any // Replace with your model type
	open: boolean
	onOpenChange: (open: boolean) => void
}

export function ViewModelDetailsDialog({ modelData, open, onOpenChange }: ViewModelDetailsDialogProps) {
	const { data: modelReferenceData, isLoading: isReferenceDataLoading } = useSeparateModelReferenceData()

	// Helper functions to get display names from reference data
	const getModelTypeName = (id?: string) => {
		if (!id) return '-'
		return modelReferenceData?.QModelType.find(t => t.qm_type_id.toString() === id)?.qm_type || id
	}

	const getPurposeName = (id?: string) => {
		if (!id) return '-'
		return modelReferenceData?.QModelPurpose.find(p => p.purpose_id.toString() === id)?.purpose || id
	}

	const getSubgroupName = (id?: string) => {
		if (!id) return '-'
		return modelReferenceData?.Subgroup.find(s => s.subgroup_id.toString() === id)?.subgroup || id
	}

	const getUseName = (id?: string) => {
		if (!id) return '-'
		return modelReferenceData?.Uses.find(u => u.use_id.toString() === id)?.use || id
	}

	const getAssetClassName = (id?: string) => {
		if (!id) return '-'
		return modelReferenceData?.AssetClass.find(a => a.assetclass_id.toString() === id)?.assetclass || id
	}

	if (!modelData || isReferenceDataLoading) {
		return (
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent className='max-w-[1400px] min-w-[50%] w-full rounded-lg bg-white p-8 dark:bg-gray-950 max-h-[80vh] overflow-auto mx-4 sm:mx-6 md:mx-8 lg:mx-10'>
					<DialogHeader>
						<DialogTitle>Model Details</DialogTitle>
						<DialogDescription>Loading model details...</DialogDescription>
					</DialogHeader>
					<div className='space-y-4'>
						<Skeleton className='h-8 w-full' />
						<Skeleton className='h-8 w-full' />
						<Skeleton className='h-8 w-full' />
					</div>
				</DialogContent>
			</Dialog>
		)
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='max-w-[1400px] min-w-[50%] w-full rounded-lg bg-white p-8 dark:bg-gray-950 max-h-[80vh] overflow-auto mx-4 sm:mx-6 md:mx-8 lg:mx-10'>
				<DialogHeader>
					<DialogTitle>Model Details</DialogTitle>
					<DialogDescription>Detailed information about the model and its uses.</DialogDescription>
				</DialogHeader>

				<Tabs defaultValue='details' className='w-full'>
					<TabsList className='grid w-full grid-cols-2'>
						<TabsTrigger value='details'>Basic Details</TabsTrigger>
						<TabsTrigger value='uses'>Model Uses</TabsTrigger>
					</TabsList>

					<TabsContent value='details'>
						<Card>
							<CardContent className='pt-6'>
								<Table>
									<TableBody>
										<TableRow>
											<TableCell className='font-medium'>Model ID</TableCell>
											<TableCell>{modelData?.id || modelData?.model_id || '-'}</TableCell>
										</TableRow>
										<TableRow>
											<TableCell className='font-medium'>Model Name</TableCell>
											<TableCell>{modelData?.modelName || '-'}</TableCell>
										</TableRow>
										<TableRow>
											<TableCell className='font-medium'>Model Type</TableCell>
											<TableCell>{getModelTypeName(modelData?.modelType)}</TableCell>
										</TableRow>
										<TableRow>
											<TableCell className='font-medium'>Purpose</TableCell>
											<TableCell>{getPurposeName(modelData?.purpose)}</TableCell>
										</TableRow>
										<TableRow>
											<TableCell className='font-medium'>Owner</TableCell>
											<TableCell>{modelData?.owner || '-'}</TableCell>
										</TableRow>
										<TableRow>
											<TableCell className='font-medium'>Accountable Executive</TableCell>
											<TableCell>{modelData?.accountableExec || '-'}</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value='uses'>
						<Card>
							<CardContent className='pt-6'>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Subgroup</TableHead>
											<TableHead>Use</TableHead>
											<TableHead>Asset Class</TableHead>
											<TableHead>Exec Usage</TableHead>
											<TableHead>User</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{modelData?.modelUses?.length ? (
											modelData.modelUses.map((use: any, index: number) => (
												<TableRow key={index}>
													<TableCell>{getSubgroupName(use?.subgroup)}</TableCell>
													<TableCell>{getUseName(use?.use)}</TableCell>
													<TableCell>{getAssetClassName(use?.assetClass)}</TableCell>
													<TableCell>{use?.execUsage || '-'}</TableCell>
													<TableCell>{use?.user || '-'}</TableCell>
												</TableRow>
											))
										) : (
											<TableRow>
												<TableCell colSpan={5} className='text-center py-4'>
													No model uses found
												</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	)
}
