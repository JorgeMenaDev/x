import { AppSidebar } from '@/components/app-sidebar'
import { ServerStatusFooterWrapper } from '@/components/server-status-footer-wrapper'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export const iframeHeight = '800px'

export const description = 'A sidebar with a header and a command menu (⌘J).'

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className='[--header-height:calc(--spacing(14))] flex flex-col min-h-screen'>
			<SidebarProvider className='flex flex-col flex-1'>
				<SiteHeader />
				<div className='flex flex-1'>
					<AppSidebar />
					<SidebarInset className='flex flex-col'>
						<div className='flex-1 overflow-auto pb-20'>{children}</div>
						<div className='mt-auto'>
							<ServerStatusFooterWrapper />
						</div>
					</SidebarInset>
				</div>
			</SidebarProvider>
		</div>
	)
}
