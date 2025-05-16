export const ACTIONS = {
  BROWSE_VISITORS: 'browseVisitors',
  INVITE_VISITOR: 'inviteVisitor',
  REGISTER_VISITOR: 'registerVisitor',
  SEARCH_VISITOR: 'searchVisitor',
  VERIFY_VISITOR: 'verifyVisitor',
  VIEW_VISITOR_MANAGEMENT: 'viewVisitorManagement',
  SHOW_ADMIN_BADGE: 'showAdminBadge',
  SHOW_GUARD_BADGE: 'showGuardBadge',
} as const

export type Action = (typeof ACTIONS)[keyof typeof ACTIONS]
export const ALL_ACTIONS: Action[] = Object.values(ACTIONS)
