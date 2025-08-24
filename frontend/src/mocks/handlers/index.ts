import { getVisitorsHandler } from './getVisitors'
import { getVisitorByIdHandler } from './getVisitorById'
import { putVisitorHandler } from './putVisitor'
import { getVisitRequestsHandler } from './getVisitRequests'
import { putVisitRequestHandler } from './putVisitRequest'
import { putInviteLinkHandler } from './putInviteLink'
import { getInviteByTokenHandler } from './getInviteByToken'
import { getVisitRequestByTokenHandler } from './getVisitRequestByToken'
import { getPermissionsHandler } from './getPermissions'
import { sendEmailHandler } from './notif/sendEmail'
import { getParameterHandler } from './ssm/get-parameter'

export function getHandlers() {
  return [
    ...getVisitorsHandler(),
    ...putVisitorHandler(),
    ...getVisitorByIdHandler(),
    ...getVisitRequestsHandler(),
    ...putVisitRequestHandler(),
    ...putInviteLinkHandler(),
    ...getInviteByTokenHandler(),
    ...getVisitRequestByTokenHandler(),
    ...getPermissionsHandler(),
    ...sendEmailHandler(),
    ...getParameterHandler(),
  ]
}
