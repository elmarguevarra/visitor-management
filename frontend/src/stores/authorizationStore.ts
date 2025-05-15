import { defineStore } from 'pinia'
import { useAuthenticationStore } from './authenticationStore'
import { getPermissions } from '@/services/awsServices'

const actions = [
  'browseVisitors',
  'inviteVisitor',
  'registerVisitor',
  'searchVisitor',
  'verifyVisitor',
]

export const useAuthorizationStore = defineStore('authorization', {
  state: () => ({
    isBrowseVisitorsAllowed: false,
    isInviteVisitorAllowed: false,
  }),
  actions: {
    async checkPermissions() {
      try {
        const authenticationStore = useAuthenticationStore()
        const userGroup = authenticationStore.userGroup
        const permissions = await getPermissions(userGroup, actions)
        console.log('permissions: ', permissions)
      } catch (err) {
        console.error('Permissions check failed:', err)
      }
    },
  },
})
