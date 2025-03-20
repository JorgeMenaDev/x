import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { ThemeToggle } from '@/components/theme-toggle'
import { Toaster } from 'sonner'
import { Providers } from '@/providers'
import { Notifications } from '@/components/notifications/notifications'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin']
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin']
})

export const metadata: Metadata = {
	title: 'Inventory System',
	description: 'Inventory management system'
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<Providers>
					<Notifications />
					<div className='flex-1'>{children}</div>
					<div className='fixed bottom-4 right-4'>
						<ThemeToggle />
					</div>
				</Providers>
			</body>
		</html>
	)
}
