import { defineStore } from 'pinia'

type Notification = {
  id: number
  message: string
  type: NotificationType
}

type NotificationType = 'success' | 'error'

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    notifications: [] as Notification[],
    nextId: 1,
  }),

  actions: {
    addNotification(message: string, type: NotificationType = 'success') {
      const id = this.nextId++
      const notification: Notification = { id, message, type }
      this.notifications.push(notification)

      setTimeout(() => {
        this.removeNotification(id)
      }, 5000)
    },

    removeNotification(id: number) {
      this.notifications = this.notifications.filter((n) => n.id !== id)
    },
  },
})
