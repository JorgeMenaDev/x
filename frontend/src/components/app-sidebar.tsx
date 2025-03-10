'use client'

import * as React from 'react'
import { BookOpen, Bot, ChartLine, Command, Frame, LifeBuoy, PieChart, Send, Settings2, ShieldUser } from 'lucide-react'
import Link from 'next/link'

import { NavMain } from '@/components/nav-main'
import { NavProjects } from '@/components/nav-projects'
import { NavSecondary } from '@/components/nav-secondary'
import { NavUser } from '@/components/nav-user'
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem
} from '@/components/ui/sidebar'

const data = {
	user: {
		name: 'shadcn',
		email: 'm@example.com',
		avatar: '/avatars/shadcn.jpg'
	},
	navMain: [
		{
			title: 'Model Hub',
			url: '',
			icon: Bot,
			items: [
				{
					title: 'Create Model',
					url: '/dashboard/models/new'
				},
				{
					title: 'Model Explorer',
					url: '/dashboard/models/explorer'
				}
			]
		},
		{
			title: 'Analytics',
			url: '',
			icon: ChartLine,
			items: [
				{
					title: 'Dependency Graph',
					url: '/dashboard/analytics/dependency-graph'
				}
			]
		},
		{
			title: 'Documentation',
			url: '/dashboard/docs',
			icon: BookOpen,
			items: [
				{
					title: 'Get Started',
					url: '/dashboard/docs/get-started'
				}
			]
		},
		{
			title: 'Settings',
			url: '/dashboard/settings',
			icon: Settings2,
			items: [
				{
					title: 'General',
					url: '/dashboard/settings/general'
				}
			]
		},
		{
			title: 'Admin',
			url: '',
			icon: ShieldUser,
			items: [
				{
					title: 'Table Editor',
					url: '/dashboard/admin/table-editor'
				}
			]
		}
	],
	navSecondary: [
		{
			title: 'Support',
			url: '/dashboard/support',
			icon: LifeBuoy
		},
		{
			title: 'Feedback',
			url: '/dashboard/feedback',
			icon: Send
		}
	],
	projects: [
		{
			name: 'MERIT',
			url: '/dashboard/projects/merit',
			icon: Frame
		},
		{
			name: 'Lemans',
			url: '/dashboard/projects/lemans',
			icon: PieChart
		}
	]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar className='top-(--header-height) h-[calc(100svh-var(--header-height))]!' {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size='lg' asChild>
							<Link href='/dashboard'>
								<div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
									<Command className='size-4' />
								</div>
								<div className='grid flex-1 text-left text-sm leading-tight'>
									<span className='truncate font-medium'>Acme Inc</span>
									<span className='truncate text-xs'>Enterprise</span>
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
				<NavProjects projects={data.projects} />
				<NavSecondary items={data.navSecondary} className='mt-auto' />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter>
		</Sidebar>
	)
}
