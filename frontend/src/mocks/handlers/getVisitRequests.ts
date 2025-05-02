import { RestHandler, rest } from 'msw'

const API_ENDPOINT = process.env.VUE_APP_API_ENDPOINT
console.log('API_ENDPOINT', API_ENDPOINT)

export const getVisitRequestsHandler = (): RestHandler[] => [
  rest.get(
    `${API_ENDPOINT}visit-requests?residentId`,
    async (req, res, ctx) => {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      return res(
        ctx.status(200),
        ctx.json([
          {
            residentId: '1234',
            visitorName: 'Maling',
            visitDate: new Date().setHours(0, 0, 0, 0),
            inviteToken: 'inviteToken1',
            requestStatus: 'PENDING',
          },
          {
            residentId: '1234',
            visitorName: 'Syeepao',
            visitDate: new Date().setHours(0, 0, 0, 0),
            inviteToken: 'inviteToken2',
            requestStatus: 'PENDING',
          },
          {
            residentId: '1234',
            visitorName: 'Molang',
            visitDate: new Date().setHours(0, 0, 0, 0),
            inviteToken: 'inviteToken3',
            requestStatus: 'DECLINED',
          },
          {
            residentId: '1234',
            visitorName: 'kwalong',
            visitDate: new Date().setHours(0, 0, 0, 0),
            inviteToken: 'inviteToken4',
            requestStatus: 'APPROVED',
          },
        ]),
      )
    },
  ),
]
