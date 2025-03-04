'use client'

import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import React from 'react'

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from '@/components/ui/breadcrumb'

/**
 * Custom breadcrumb component that automatically generates breadcrumbs based on the current route
 *
 * @returns A breadcrumb navigation component
 */
export function CustomBreadcrumb({ className }: { className?: string }) {
	const pathname = usePathname()

	// Generate breadcrumb items based on the current path
	const breadcrumbItems = useMemo(() => {
		// Skip generating breadcrumbs for the home page
		if (pathname === '/') return []

		// Split the path into segments and filter out empty segments
		const segments = pathname.split('/').filter(Boolean)

		// Generate breadcrumb items for each segment
		return segments.map((segment, index) => {
			// Create the path for this breadcrumb item
			const path = `/${segments.slice(0, index + 1).join('/')}`

			// Format the segment for display (capitalize and replace hyphens with spaces)
			const formattedSegment = segment
				.split('-')
				.map(word => word.charAt(0).toUpperCase() + word.slice(1))
				.join(' ')

			// Check if this is the last segment (current page)
			const isLastSegment = index === segments.length - 1

			return {
				name: formattedSegment,
				path,
				isCurrentPage: isLastSegment
			}
		})
	}, [pathname])

	// Don't render breadcrumbs if there are no items (e.g., on the home page)
	if (breadcrumbItems.length === 0) return null

	return (
		<Breadcrumb className={className}>
			<BreadcrumbList>
				{/* Home link is always the first item */}
				<BreadcrumbItem>
					<BreadcrumbLink href='/'>Home</BreadcrumbLink>
				</BreadcrumbItem>

				{/* Separator after Home */}
				<BreadcrumbSeparator />

				{/* Render dynamic breadcrumb items */}
				{breadcrumbItems.map(item => (
					<React.Fragment key={item.path}>
						<BreadcrumbItem>
							{item.isCurrentPage ? (
								<BreadcrumbPage>{item.name}</BreadcrumbPage>
							) : (
								<BreadcrumbLink href={item.path}>{item.name}</BreadcrumbLink>
							)}
						</BreadcrumbItem>

						{/* Add separator only if not the last item */}
						{!item.isCurrentPage && <BreadcrumbSeparator />}
					</React.Fragment>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	)
}
