'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

/**
 * Client component wrapper for React Query provider
 * Creates a new QueryClient for each request
 */
export function Providers({ children }: { children: React.ReactNode }) {
	// Create a new QueryClient for each request
	const [queryClient] = useState(() => new QueryClient())

	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
