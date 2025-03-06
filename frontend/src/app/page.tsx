import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { Navbar } from '@/components/Navbar'

export default function Home() {
	return (
		<div className='flex flex-col min-h-screen'>
			<Navbar />
			<div className='flex-1'>
				<div className='container mx-auto py-16 px-4'>
					<div className='max-w-3xl mx-auto text-center space-y-8'>
						<h1 className='text-4xl font-bold tracking-tight'>Inventory Management System</h1>
						<p className='text-xl text-muted-foreground'>
							Access and manage database tables through a simple interface
						</p>

						<div className='flex justify-center gap-4 pt-4'>
							<Button asChild size='lg'>
								<Link href='/dashboard/admin/table-editor'>
									Go to Table Editor <ArrowRight className='ml-2 h-4 w-4' />
								</Link>
							</Button>
							<Button asChild size='lg' variant='outline'>
								<Link href='/qm-purpose'>View QM Purpose Table</Link>
							</Button>

							{/* go to dashboard */}
							<Button asChild size='lg' variant='outline'>
								<Link href='/dashboard'>View Dashboard</Link>
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
