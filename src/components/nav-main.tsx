'use client'

import { ChevronRight, type LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem
} from '@/components/ui/sidebar'

export function NavMain({
	items
}: {
	items: {
		title: string
		url: string
		icon: LucideIcon
		isActive?: boolean
		items?: {
			title: string
			url: string
		}[]
	}[]
}) {
	const pathname = usePathname()

	// Check if a URL matches or is a parent of the current path
	const isActiveUrl = (url: string) => {
		if (url === '#') return false
		return pathname?.startsWith(url)
	}

	// Check if any child items are active
	const hasActiveChild = (items?: { url: string }[]) => {
		return items?.some(item => isActiveUrl(item.url)) ?? false
	}

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Platform</SidebarGroupLabel>
			<SidebarMenu>
				{items.map(item => {
					const isItemActive = isActiveUrl(item.url)
					const isGroupActive = isItemActive || hasActiveChild(item.items)

					return (
						<Collapsible key={item.title} asChild defaultOpen={isGroupActive}>
							<SidebarMenuItem>
								<SidebarMenuButton asChild tooltip={item.title} isActive={isItemActive}>
									<Link href={item.url}>
										<item.icon />
										<span>{item.title}</span>
									</Link>
								</SidebarMenuButton>
								{item.items?.length ? (
									<>
										<CollapsibleTrigger asChild>
											<SidebarMenuAction className='data-[state=open]:rotate-90'>
												<ChevronRight />
												<span className='sr-only'>Toggle</span>
											</SidebarMenuAction>
										</CollapsibleTrigger>
										<CollapsibleContent>
											<SidebarMenuSub>
												{item.items?.map(subItem => {
													const isSubItemActive = isActiveUrl(subItem.url)
													return (
														<SidebarMenuSubItem key={subItem.title}>
															<SidebarMenuSubButton asChild isActive={isSubItemActive}>
																<Link href={subItem.url}>
																	<span>{subItem.title}</span>
																</Link>
															</SidebarMenuSubButton>
														</SidebarMenuSubItem>
													)
												})}
											</SidebarMenuSub>
										</CollapsibleContent>
									</>
								) : null}
							</SidebarMenuItem>
						</Collapsible>
					)
				})}
			</SidebarMenu>
		</SidebarGroup>
	)
}
