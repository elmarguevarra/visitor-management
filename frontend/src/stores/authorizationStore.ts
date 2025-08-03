import { defineStore } from 'pinia'
import { useAuthenticationStore } from './authenticationStore'
import { evaluatePermissions as getPermissions } from '@/services/handlerServices'
import { ALL_ACTIONS, Action } from '@/constants/actions'

const ALLOW = 'ALLOW'

export const useAuthorizationStore = defineStore('authorization', {
  state: () => ({
    permissions: {} as Record<string, boolean>,
  }),
  actions: {
    async loadUserPermissions() {
      try {
        const authenticationStore = useAuthenticationStore()
        const userGroup = authenticationStore.userGroup

        const permissions = await getPermissions(userGroup, ALL_ACTIONS)

        if (permissions.results) {
          const permissionMap: Record<string, boolean> = {}
          permissions.results.forEach((permission: any) => {
            permissionMap[permission.request.action.actionId] =
              permission.decision === ALLOW
          })
          this.permissions = permissionMap

          console.debug('permissions: ', permissions)
        } else {
          console.warn('Invalid permissions result:', permissions)
        }
      } catch (err) {
        console.error('Permissions check failed:', err)
      }
    },
    hasPermissionOnAction(action: Action): boolean {
      return !!this.permissions[action]
    },
  },
})
