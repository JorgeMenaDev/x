import { nanoid } from 'nanoid'
import { create } from 'zustand'
// @ts-expect-error - SetState is not exported from zustand
import { SetState } from 'zustand'

export type Notification = {
	id: string
	type: 'info' | 'warning' | 'success' | 'error'
	title: string
	message?: string
}

type NotificationsStore = {
	notifications: Notification[]
	addNotification: (notification: Omit<Notification, 'id'>) => void
	dismissNotification: (id: string) => void
}

export const useNotifications = create<NotificationsStore>((set: SetState<NotificationsStore>) => ({
	notifications: [],
	addNotification: (notification: Omit<Notification, 'id'>) =>
		set((state: NotificationsStore) => ({
			notifications: [...state.notifications, { id: nanoid(), ...notification }]
		})),
	dismissNotification: (id: string) =>
		set((state: NotificationsStore) => ({
			notifications: state.notifications.filter((notification: Notification) => notification.id !== id)
		}))
}))
