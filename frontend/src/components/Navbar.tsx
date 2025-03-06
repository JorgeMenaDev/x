'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export function Navbar() {
	const pathname = usePathname()

	const navItems = [
		{ href: '/', label: 'Home' },
		{ href: '/qm-purpose', label: 'QM Purpose' },
		{ href: '/table-editor', label: 'Table Editor' }
	]

	return (
		<nav className='border-b'>
			<div className='container mx-auto flex h-16 items-center px-4'>
				<div className='mr-4 font-bold'>Inventory System</div>
				<div className='flex gap-4'>
					{navItems.map(item => (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								'text-sm transition-colors hover:text-primary',
								pathname === item.href ? 'text-foreground font-medium' : 'text-muted-foreground'
							)}
						>
							{item.label}
						</Link>
					))}
				</div>
			</div>
		</nav>
	)
}
