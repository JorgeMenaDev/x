'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

export function ThemeToggle() {
	const { setTheme } = useTheme()

	return (
		<div className='fixed top-4 right-4 z-50'>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant='outline'
						size='icon'
						className='rounded-full bg-[#231F20]/20 dark:bg-[#00864F]/20 border-[#00864F] dark:border-[#231F20] hover:bg-[#231F20]/30 dark:hover:bg-[#00864F]/30'
					>
						<Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all text-[#00864F] dark:-rotate-90 dark:scale-0' />
						<Moon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all text-[#231F20] dark:rotate-0 dark:scale-100' />
						<span className='sr-only'>Toggle theme</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					align='end'
					className='bg-[#231F20] dark:bg-[#00864F] text-white dark:text-[#231F20] border-[#00864F] dark:border-[#231F20]'
				>
					<DropdownMenuItem
						onClick={() => setTheme('light')}
						className='hover:bg-[#231F20]/80 dark:hover:bg-[#00864F]/80 cursor-pointer'
					>
						Light
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => setTheme('dark')}
						className='hover:bg-[#231F20]/80 dark:hover:bg-[#00864F]/80 cursor-pointer'
					>
						Dark
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => setTheme('system')}
						className='hover:bg-[#231F20]/80 dark:hover:bg-[#00864F]/80 cursor-pointer'
					>
						System
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}
