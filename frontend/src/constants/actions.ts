export const ACTIONS = {
  UI: {
    BROWSE_VISITORS: 'browseVisitors',
    INVITE_VISITOR: 'inviteVisitor',
    REGISTER_VISITOR: 'registerVisitor',
    SEARCH_VISITOR: 'searchVisitor',
    VERIFY_VISITOR: 'verifyVisitor',
    VIEW_VISITOR_MANAGEMENT: 'viewVisitorManagement',
    SHOW_ADMIN_BADGE: 'showAdminBadge',
    SHOW_GUARD_BADGE: 'showGuardBadge',
  },
  API: {
    GET_PERMISSIONS: 'getPermissions',
    GET_VISITORS: 'getVisitorsByResidentId',
    GET_VISIT_REQUESTS: 'getVisitRequestsByResidentId',
    GET_VISITOR: 'getVisitorByRegistrationId',
    GET_INVITE: 'getInviteByToken',
    GET_VISIT_REQUEST: 'getVisitRequestByToken',
    POST_VISITOR: 'postVisitor',
    POST_INVITE: 'postInvite',
    POST_VISIT_REQUEST: 'postVisitRequest',
  },
} as const

// Type definitions
export type RouteAction = (typeof ACTIONS)['UI'][keyof (typeof ACTIONS)['UI']]
export type ApiAction = (typeof ACTIONS)['API'][keyof (typeof ACTIONS)['API']]
export type Action = RouteAction | ApiAction

// Utility arrays
export const ALL_ROUTE_ACTIONS = Object.values(ACTIONS.UI) as RouteAction[]
export const ALL_API_ACTIONS = Object.values(ACTIONS.API) as ApiAction[]
export const ALL_ACTIONS = [
  ...ALL_ROUTE_ACTIONS,
  ...ALL_API_ACTIONS,
] as Action[]
