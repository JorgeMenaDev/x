import { nanoid } from 'nanoid'
import { create } from 'zustand'
// @ts-expect-error - SetState is not exported from zustand
import { SetState } from 'zustand'
import { toast } from 'sonner'

export type Notification = {
	id: string
	type: 'info' | 'warning' | 'success' | 'error'
	title: string
	message?: string
}

type NotificationsStore = {
	notifications: Notification[]
	addNotification: (notification: Omit<Notification, 'id'>) => string
	dismissNotification: (id: string) => void
}

export const useNotifications = create<NotificationsStore>((set: SetState<NotificationsStore>) => ({
	notifications: [],
	addNotification: (notification: Omit<Notification, 'id'>) => {
		// Generate a unique ID for the notification
		const id = nanoid()

		// Add the notification to the store
		set((state: NotificationsStore) => ({
			notifications: [...state.notifications, { id, ...notification }]
		}))

		// Return the ID so it can be used to dismiss the notification later
		return id
	},
	dismissNotification: (id: string) => {
		// Dismiss the notification from the store
		set((state: NotificationsStore) => ({
			notifications: state.notifications.filter((notification: Notification) => notification.id !== id)
		}))

		// Also dismiss it from Sonner if it's still showing
		toast.dismiss(id)
	}
}))
