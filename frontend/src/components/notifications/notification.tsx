'use client'

import { Info, CircleAlert, CircleX, CircleCheck } from 'lucide-react'
import { toast } from 'sonner'
import type { Notification as NotificationType } from './notifications-store'

// Define icons for different notification types
const icons = {
	info: <Info className='size-6 text-blue-500' aria-hidden='true' />,
	success: <CircleCheck className='size-6 text-green-500' aria-hidden='true' />,
	warning: <CircleAlert className='size-6 text-yellow-500' aria-hidden='true' />,
	error: <CircleX className='size-6 text-red-500' aria-hidden='true' />
}

// This function will be used to show notifications using Sonner toast
export const showNotification = (notification: NotificationType) => {
	const { id, type, title, message } = notification

	// Use the appropriate toast method based on notification type
	switch (type) {
		case 'success':
			toast.success(title, {
				id,
				description: message,
				icon: icons.success,
				duration: 4000
			})
			break
		case 'error':
			toast.error(title, {
				id,
				description: message,
				icon: icons.error,
				duration: 6000
			})
			break
		case 'warning':
			toast.warning(title, {
				id,
				description: message,
				icon: icons.warning,
				duration: 5000
			})
			break
		case 'info':
		default:
			toast.info(title, {
				id,
				description: message,
				icon: icons.info,
				duration: 4000
			})
			break
	}

	return id
}

// Create a direct API that mimics the useNotifications API but uses Sonner directly
// This can be used as a simpler alternative to the store in some cases
export const showToast = {
	success: (title: string, message?: string) => {
		return toast.success(title, {
			description: message,
			icon: icons.success,
			duration: 4000
		})
	},
	error: (title: string, message?: string) => {
		return toast.error(title, {
			description: message,
			icon: icons.error,
			duration: 6000
		})
	},
	warning: (title: string, message?: string) => {
		return toast.warning(title, {
			description: message,
			icon: icons.warning,
			duration: 5000
		})
	},
	info: (title: string, message?: string) => {
		return toast.info(title, {
			description: message,
			icon: icons.info,
			duration: 4000
		})
	},
	dismiss: (id: string) => {
		toast.dismiss(id)
	}
}

// Keep the original component for backward compatibility if needed
export type NotificationProps = {
	notification: {
		id: string
		type: keyof typeof icons
		title: string
		message?: string
	}
	onDismiss: (id: string) => void
}

// This component is now just a wrapper that calls the toast function
export const Notification = ({ notification }: Omit<NotificationProps, 'onDismiss'>) => {
	// Show the notification using Sonner toast
	showNotification(notification)

	// Return null as we're using Sonner's toast system instead of rendering our own component
	return null
}
