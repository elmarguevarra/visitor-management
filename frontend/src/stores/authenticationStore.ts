import { defineStore } from 'pinia'
import { signOutRedirect, userManager } from '@/auth/authConfig'
import { User } from 'oidc-client-ts'

interface UserProfile {
  email?: string
  given_names?: string
  family_name?: string
  phone_number?: string
  'cognito:groups'?: string[]
  [key: string]: any
}

export const useAuthenticationStore = defineStore('authentication', {
  state: () => ({
    isLoggedIn: false,
    user: null as User | null,
    userEmail: undefined as string | undefined,
    userGivenName: undefined as string | undefined,
    userFamilyName: undefined as string | undefined,
    userPhoneNumber: undefined as string | undefined,
    userGroup: undefined as string | undefined,
  }),
  actions: {
    async loadUser(user?: any) {
      try {
        if (!user) {
          user = await userManager.getUser()
        }
        this.isLoggedIn = !!user && !user.expired
        this.user = user

        const profile = user?.profile as UserProfile | undefined
        this.userEmail = profile?.email
        this.userGivenName = profile?.given_name
        this.userFamilyName = profile?.family_name
        this.userPhoneNumber = profile?.phone_number

        const groups = profile?.['cognito:groups'] || []
        this.userGroup = groups.find((g) => !g.endsWith('_Google'))
      } catch (err) {
        this.isLoggedIn = false
        console.error('Auth check failed:', err)
      }
    },
    async signIn() {
      await userManager.signinRedirect()
    },
    async signOut() {
      this.isLoggedIn = false
      this.user = null
      this.userEmail = undefined
      this.userGivenName = undefined
      this.userFamilyName = undefined
      this.userPhoneNumber = undefined
      this.userGroup = undefined

      await this.removeUser()
      await signOutRedirect()
    },
    async removeUser() {
      await userManager.removeUser()
    },
  },
})
