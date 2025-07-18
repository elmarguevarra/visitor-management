import { VISIT_REQUEST_STATUS } from '@/constants/status'
import { RestHandler, rest } from 'msw'

export const getVisitRequestByTokenHandler = (): RestHandler[] => [
  rest.get('visit-request/:inviteToken', async (req, res, ctx) => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    return res(
      ctx.status(200),
      ctx.json({
        residentId: '1234',
        inviteToken: 'token',
        registrationId: 'fsfsdsdfs',
        visitorName: 'visitorName',
        visitDate: new Date(new Date().setDate(new Date().getDate() + 1)),
        purpose: 'coaching',
        requestStatus: VISIT_REQUEST_STATUS.PENDING,
      }),
    )
  }),
]
