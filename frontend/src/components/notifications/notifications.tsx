'use client'

import { useEffect } from 'react'
import { useNotifications } from './notifications-store'
import { showNotification } from './notification'
import type { Notification as NotificationType } from './notifications-store'

// This component is now just a wrapper that processes notifications from the store
// and passes them to Sonner toast
export const Notifications = () => {
	const { notifications, dismissNotification } = useNotifications()

	// Watch for changes in notifications and show new ones
	useEffect(() => {
		// Process any new notifications
		notifications.forEach((notification: NotificationType) => {
			// Check if this toast is already displayed (to avoid duplicates)
			const existingToast = document.querySelector(`[data-sonner-toast][data-id="${notification.id}"]`)
			if (!existingToast) {
				// Show the notification using our helper function
				showNotification(notification)

				// Add a listener to handle dismissal through Sonner's UI
				// This is handled separately through the toast-dismiss event
			}
		})

		// Setup a listener for when toasts are dismissed through Sonner's UI
		const handleToastDismiss = (event: CustomEvent) => {
			if (event.detail?.id) {
				dismissNotification(event.detail.id)
			}
		}

		// Listen for Sonner's dismiss events
		document.addEventListener('toast-dismiss', handleToastDismiss as EventListener)

		return () => {
			document.removeEventListener('toast-dismiss', handleToastDismiss as EventListener)
		}
	}, [notifications, dismissNotification])

	// We don't need to render anything here as Sonner's <Toaster /> is already in the layout
	return null
}
