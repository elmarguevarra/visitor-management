import { defineStore } from 'pinia'

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    message: '',
    isVisible: false,
    queue: [] as string[], // Queue to hold multiple notifications
  }),

  actions: {
    addNotification(message: string) {
      // Add the new message to the queue
      this.queue.push(message)

      // If the toast is not currently visible, show the next message in the queue
      if (!this.isVisible) {
        this.showNextNotification()
      }
    },

    showNextNotification() {
      // Take the first message from the queue and store it in a local variable
      const nextMessage = this.queue.shift()

      // Check that the variable is not undefined before assigning it
      if (nextMessage !== undefined) {
        this.message = nextMessage
        this.isVisible = true

        // Automatically hide the toast after 3 seconds
        setTimeout(() => {
          this.hideNotification()
        }, 3000)
      }
    },

    hideNotification() {
      this.isVisible = false
      // Wait a moment for the transition to finish before showing the next one
      setTimeout(() => {
        this.showNextNotification()
      }, 500) // 500ms delay to allow the hide transition
    },
  },
})
