import { defineStore } from 'pinia'
import { useAuthenticationStore } from './authenticationStore'
import { getPermissions } from '@/services/awsServices'

const actions = [
  'browseVisitors',
  'inviteVisitor',
  'registerVisitor',
  'searchVisitor',
  'verifyVisitor',
  'viewVisitorManagement',
]

const ALLOW = 'ALLOW'

export const useAuthorizationStore = defineStore('authorization', {
  state: () => ({
    isBrowseVisitorsAllowed: false,
    isInviteVisitorAllowed: false,
    isRegisterVisitorAllowed: false,
    isSearchVisitorAllowed: false,
    isVerifyVisitorAllowed: false,
    isViewVisitorManagementAllowed: false,
    permissions: {} as Record<string, boolean>,
  }),
  actions: {
    async checkPermissions() {
      try {
        const authenticationStore = useAuthenticationStore()
        const userGroup = authenticationStore.userGroup
        const permissions = await getPermissions(userGroup, actions)

        if (permissions.results) {
          const permissionMap: Record<string, boolean> = {}
          permissions.results.forEach((permission: any) => {
            permissionMap[permission.request.action.actionId] =
              permission.decision == ALLOW
          })
          this.isBrowseVisitorsAllowed = !!permissionMap.browseVisitors
          this.isInviteVisitorAllowed = !!permissionMap.inviteVisitor
          this.isRegisterVisitorAllowed = !!permissionMap.registerVisitor
          this.isSearchVisitorAllowed = !!permissionMap.searchVisitor
          this.isVerifyVisitorAllowed = !!permissionMap.verifyVisitor
          this.isViewVisitorManagementAllowed =
            !!permissionMap.viewVisitorManagement

          this.permissions = permissionMap

          console.log('permissions: ', permissions)
        } else {
          console.warn('Invalid permissions result:', permissions)
          this.resetPermissions()
        }
      } catch (err) {
        console.error('Permissions check failed:', err)
        this.resetPermissions()
      }
    },
    resetPermissions() {
      this.isBrowseVisitorsAllowed = false
      this.isInviteVisitorAllowed = false
      this.isRegisterVisitorAllowed = false
      this.isSearchVisitorAllowed = false
      this.isVerifyVisitorAllowed = false
      this.isViewVisitorManagementAllowed = false
    },
  },
})
