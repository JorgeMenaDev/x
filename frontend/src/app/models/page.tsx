import { ModelExplorer } from '@/features/model-explorer/model-explorer'

export default async function ModelsPage({
	searchParams
}: {
	searchParams: { [key: string]: string | string[] | undefined }
}) {
	return <ModelExplorer searchParams={Promise.resolve(searchParams)} />
}
