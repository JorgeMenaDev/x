// Simple search params parser for the model explorer
export const searchParamsCache = {
	parse: (searchParams: { [key: string]: string | string[] | undefined }) => {
		return searchParams || {}
	}
}
