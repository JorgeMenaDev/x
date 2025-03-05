'use client'

import * as React from 'react'
import {
	Calculator,
	Calendar,
	CreditCard,
	FileText,
	Inbox,
	LayoutDashboard,
	Moon,
	Search,
	Settings,
	ShoppingCart,
	Sun,
	User
} from 'lucide-react'

import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut
} from '@/components/ui/command'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'

// Define the command item type
type CommandItemType = {
	icon: React.ReactNode
	name: string
	shortcut?: string
	action?: () => void
}

export function CommandMenu({ className }: { className?: string }) {
	const [open, setOpen] = React.useState(false)
	const [recentCommands, setRecentCommands] = React.useState<CommandItemType[]>([])
	const { setTheme } = useTheme()

	// Load recent commands from localStorage on component mount
	React.useEffect(() => {
		const storedRecents = localStorage.getItem('recentCommands')
		if (storedRecents) {
			try {
				// We can only store the names in localStorage, so we need to reconstruct the objects
				const recentNames = JSON.parse(storedRecents) as string[]
				const reconstructedRecents = recentNames
					.map(name => {
						// Find the command in our predefined commands
						const allCommands = [...navigationCommands, ...toolsCommands, ...settingsCommands, ...themeCommands]
						return allCommands.find(cmd => cmd.name === name) || { name, icon: <Search className='mr-2 h-4 w-4' /> }
					})
					.filter(Boolean) as CommandItemType[]

				setRecentCommands(reconstructedRecents.slice(0, 3))
			} catch (error) {
				console.error('Failed to parse recent commands:', error)
			}
		}
	}, [])

	// Function to add a command to recent list
	const addToRecents = (command: CommandItemType) => {
		setRecentCommands(prev => {
			// Remove the command if it already exists
			const filtered = prev.filter(cmd => cmd.name !== command.name)
			// Add the command to the beginning and limit to 3 items
			const newRecents = [command, ...filtered].slice(0, 3)

			// Save to localStorage (just the names)
			localStorage.setItem('recentCommands', JSON.stringify(newRecents.map(cmd => cmd.name)))

			return newRecents
		})
	}

	// Handle command selection
	const runCommand = (command: CommandItemType) => {
		if (command.action) {
			command.action()
		}
		addToRecents(command)
		setOpen(false)
	}

	// Keyboard shortcut handler
	React.useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === 'j' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault()
				setOpen(open => !open)
			}
		}

		document.addEventListener('keydown', down)
		return () => document.removeEventListener('keydown', down)
	}, [])

	// Define command groups
	const navigationCommands: CommandItemType[] = [
		{
			icon: <LayoutDashboard className='mr-2 h-4 w-4' />,
			name: 'Dashboard',
			action: () => console.log('Navigate to Dashboard')
		},
		{
			icon: <Inbox className='mr-2 h-4 w-4' />,
			name: 'Inbox',
			shortcut: '⌘I',
			action: () => console.log('Navigate to Inbox')
		},
		{
			icon: <FileText className='mr-2 h-4 w-4' />,
			name: 'Documents',
			shortcut: '⌘D',
			action: () => console.log('Navigate to Documents')
		}
	]

	const toolsCommands: CommandItemType[] = [
		{
			icon: <Calendar className='mr-2 h-4 w-4' />,
			name: 'Calendar',
			shortcut: '⌘C',
			action: () => console.log('Open Calendar')
		},
		{
			icon: <ShoppingCart className='mr-2 h-4 w-4' />,
			name: 'Products',
			shortcut: '⌘P',
			action: () => console.log('View Products')
		},
		{
			icon: <Calculator className='mr-2 h-4 w-4' />,
			name: 'Calculator',
			shortcut: '⌘K',
			action: () => console.log('Open Calculator')
		}
	]

	const settingsCommands: CommandItemType[] = [
		{
			icon: <User className='mr-2 h-4 w-4' />,
			name: 'Profile',
			shortcut: '⌘U',
			action: () => console.log('Open Profile')
		},
		{
			icon: <CreditCard className='mr-2 h-4 w-4' />,
			name: 'Billing',
			shortcut: '⌘B',
			action: () => console.log('Open Billing')
		},
		{
			icon: <Settings className='mr-2 h-4 w-4' />,
			name: 'Settings',
			shortcut: '⌘S',
			action: () => console.log('Open Settings')
		}
	]

	const themeCommands: CommandItemType[] = [
		{
			icon: <Sun className='mr-2 h-4 w-4' />,
			name: 'Light Mode',
			action: () => setTheme('light')
		},
		{
			icon: <Moon className='mr-2 h-4 w-4' />,
			name: 'Dark Mode',
			action: () => setTheme('dark')
		},
		{
			icon: <Settings className='mr-2 h-4 w-4' />,
			name: 'System Theme',
			action: () => setTheme('system')
		}
	]

	return (
		<div className={className}>
			<Button
				variant='outline'
				className='relative h-8 w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64'
				onClick={() => setOpen(true)}
			>
				<Search className='mr-2 h-4 w-4' />
				<span>Search...</span>
				<kbd className='pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex'>
					<span className='text-xs'>⌘</span>J
				</kbd>
			</Button>
			<CommandDialog open={open} onOpenChange={setOpen}>
				<CommandInput placeholder='Type a command or search...' />
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>

					{recentCommands.length > 0 && (
						<>
							<CommandGroup heading='Recent'>
								{recentCommands.map((command, index) => (
									<CommandItem key={`recent-${index}`} onSelect={() => runCommand(command)}>
										{command.icon}
										<span>{command.name}</span>
										{command.shortcut && <CommandShortcut>{command.shortcut}</CommandShortcut>}
									</CommandItem>
								))}
							</CommandGroup>
							<CommandSeparator />
						</>
					)}

					<CommandGroup heading='Navigation'>
						{navigationCommands.map((command, index) => (
							<CommandItem key={`nav-${index}`} onSelect={() => runCommand(command)}>
								{command.icon}
								<span>{command.name}</span>
								{command.shortcut && <CommandShortcut>{command.shortcut}</CommandShortcut>}
							</CommandItem>
						))}
					</CommandGroup>

					<CommandSeparator />

					<CommandGroup heading='Tools'>
						{toolsCommands.map((command, index) => (
							<CommandItem key={`tool-${index}`} onSelect={() => runCommand(command)}>
								{command.icon}
								<span>{command.name}</span>
								{command.shortcut && <CommandShortcut>{command.shortcut}</CommandShortcut>}
							</CommandItem>
						))}
					</CommandGroup>

					<CommandSeparator />

					<CommandGroup heading='Settings'>
						{settingsCommands.map((command, index) => (
							<CommandItem key={`setting-${index}`} onSelect={() => runCommand(command)}>
								{command.icon}
								<span>{command.name}</span>
								{command.shortcut && <CommandShortcut>{command.shortcut}</CommandShortcut>}
							</CommandItem>
						))}
					</CommandGroup>

					<CommandSeparator />

					<CommandGroup heading='Theme'>
						{themeCommands.map((command, index) => (
							<CommandItem key={`theme-${index}`} onSelect={() => runCommand(command)}>
								{command.icon}
								<span>{command.name}</span>
								{command.shortcut && <CommandShortcut>{command.shortcut}</CommandShortcut>}
							</CommandItem>
						))}
					</CommandGroup>
				</CommandList>
			</CommandDialog>
		</div>
	)
}
