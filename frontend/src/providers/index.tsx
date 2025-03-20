'use client'

import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { ReactQueryProvider } from './react-query'

/**
 * Client component wrapper for React Query provider
 * Creates a new QueryClient for each request
 */
export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ReactQueryProvider>
			<NuqsAdapter>
				<ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
					{children}
					<Toaster richColors />
				</ThemeProvider>
			</NuqsAdapter>
		</ReactQueryProvider>
	)
}
