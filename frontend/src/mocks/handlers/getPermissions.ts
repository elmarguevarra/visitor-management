import { rest } from 'msw'
import { ALL_ACTIONS } from '@/constants/actions'

// Mock permissions response that grants all permissions
// You can customize this based on different user groups if needed
const mockPermissionsResponse = {
  results: ALL_ACTIONS.map((action) => ({
    request: {
      action: {
        actionId: action,
      },
    },
    decision: 'ALLOW', // Grant all permissions for development
  })),
}

// Alternative: Mock permissions for specific user groups
const getPermissionsByGroup = (userGroup: string) => {
  switch (userGroup) {
    case 'admin':
      // Admin gets all permissions
      return {
        results: ALL_ACTIONS.map((action) => ({
          request: {
            action: {
              actionId: action,
            },
          },
          decision: 'ALLOW',
        })),
      }
    case 'guard':
      // Guard gets limited permissions
      return {
        results: ALL_ACTIONS.map((action) => {
          const isAllowed = [
            'browseVisitors',
            'searchVisitor',
            'verifyVisitor',
            'showGuardBadge',
            'getVisitorsByResidentId',
            'getVisitorByRegistrationId',
            'getPermissions',
          ].includes(action)

          return {
            request: {
              action: {
                actionId: action,
              },
            },
            decision: isAllowed ? 'ALLOW' : 'DENY',
          }
        }),
      }
    case 'resident':
      // Resident gets basic permissions
      return {
        results: ALL_ACTIONS.map((action) => {
          const isAllowed = [
            'inviteVisitor',
            'registerVisitor',
            'getVisitorsByResidentId',
            'getVisitRequestsByResidentId',
            'postVisitor',
            'postInvite',
            'postVisitRequest',
            'getPermissions',
          ].includes(action)

          return {
            request: {
              action: {
                actionId: action,
              },
            },
            decision: isAllowed ? 'ALLOW' : 'DENY',
          }
        }),
      }
    default:
      // Unassigned or unknown groups get minimal permissions
      return {
        results: ALL_ACTIONS.map((action) => ({
          request: {
            action: {
              actionId: action,
            },
          },
          decision: 'DENY',
        })),
      }
  }
}

export function getPermissionsHandler() {
  return [
    rest.get('permissions', (req, res, ctx) => {
      // Get principalId (user group) from query parameters
      const principalId =
        req.url.searchParams.get('principalId') || 'unassigned'
      const actionsParam = req.url.searchParams.get('actions')

      console.log(
        `[MSW] GET /permissions - principalId: ${principalId}, actions: ${actionsParam}`,
      )

      // Get permissions based on user group
      const permissionsResponse = getPermissionsByGroup(principalId)

      // If specific actions are requested, filter the response
      if (actionsParam) {
        const requestedActions = actionsParam.split(',')
        permissionsResponse.results = permissionsResponse.results.filter(
          (permission) =>
            requestedActions.includes(permission.request.action.actionId),
        )
      }

      return res(
        ctx.status(200),
        ctx.json(permissionsResponse),
        ctx.delay(100), // Simulate network delay
      )
    }),

    // Handle the case where API_BASE is empty (fallback to relative path)
    rest.get('/permissions', (req, res, ctx) => {
      const principalId =
        req.url.searchParams.get('principalId') || 'unassigned'
      const actionsParam = req.url.searchParams.get('actions')

      console.log(
        `[MSW] GET /permissions (fallback) - principalId: ${principalId}, actions: ${actionsParam}`,
      )

      const permissionsResponse = getPermissionsByGroup(principalId)

      if (actionsParam) {
        const requestedActions = actionsParam.split(',')
        permissionsResponse.results = permissionsResponse.results.filter(
          (permission) =>
            requestedActions.includes(permission.request.action.actionId),
        )
      }

      return res(ctx.status(200), ctx.json(permissionsResponse), ctx.delay(100))
    }),
  ]
}
