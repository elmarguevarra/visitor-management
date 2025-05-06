import { defineStore } from 'pinia'
import { signOutRedirect, userManager } from '@/auth/authConfig'

export const useAuthenticationStore = defineStore('authentication', {
  state: () => ({
    isLoggedIn: false,
    currentResidentId: '1234',
  }),
  actions: {
    async checkAuthenticationStatus() {
      try {
        const user = await userManager.getUser()
        this.isLoggedIn = !!user && !user.expired
      } catch (err) {
        this.isLoggedIn = false
        console.error('Auth check failed:', err)
      }
    },
    async signIn() {
      await userManager.signinRedirect()
    },
    async signOut() {
      await signOutRedirect()
    },
    async removeUser() {
      await userManager.removeUser()
    },
  },
})
