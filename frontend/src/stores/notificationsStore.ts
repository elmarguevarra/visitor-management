import { defineStore } from 'pinia'

type Notification = {
  id: number
  message: string
}

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    notifications: [] as Notification[],
    nextId: 1,
  }),

  actions: {
    addNotification(message: string) {
      const id = this.nextId++
      const notification: Notification = { id, message }
      this.notifications.push(notification)

      setTimeout(() => {
        this.removeNotification(id)
      }, 3000)
    },

    removeNotification(id: number) {
      this.notifications = this.notifications.filter((n) => n.id !== id)
    },
  },
})
