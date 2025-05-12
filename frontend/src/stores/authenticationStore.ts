import { defineStore } from 'pinia'
import { signOutRedirect, userManager } from '@/auth/authConfig'
import { User } from 'oidc-client-ts'

export const useAuthenticationStore = defineStore('authentication', {
  state: () => ({
    isLoggedIn: false,
    user: null as User | null,
    userEmail: undefined as string | undefined,
    userGivenName: undefined as string | undefined,
    userFamilyName: undefined as string | undefined,
    userPhoneNumber: undefined as string | undefined,
  }),
  actions: {
    async checkAuthenticationStatus() {
      try {
        const user = await userManager.getUser()
        console.log('authenticationStore.user: ', user)
        this.isLoggedIn = !!user && !user.expired
        this.user = user
        this.userEmail = user?.profile.email
        this.userGivenName = user?.profile.given_name
        this.userFamilyName = user?.profile.family_name
        this.userPhoneNumber = user?.profile.phone_number
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
