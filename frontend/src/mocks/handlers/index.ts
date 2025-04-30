import { getUserItemsHandler } from './getUserItems'
import { getItemHandler } from './getItem'
import { putItemHandler } from './putItem'
import { getVisitRequestsHandler } from './getVisitRequests'
import { putVisitRequestHandler } from './putVisitRequest'
import { putInviteLinkHandler } from './putInviteLink'
import { getInviteByTokenHandler } from './getInviteByToken'

export function getHandlers() {
  return [
    ...getUserItemsHandler(),
    ...putItemHandler(),
    ...getItemHandler(),
    ...getVisitRequestsHandler(),
    ...putVisitRequestHandler(),
    ...putInviteLinkHandler(),
    ...getInviteByTokenHandler(),
  ]
}
