import { RestHandler, rest } from 'msw'

const API_ENDPOINT = process.env.VUE_APP_API_ENDPOINT
console.log('API_ENDPOINT', API_ENDPOINT)

export const getVisitRequestsHandler = (): RestHandler[] => [
  rest.get(`${API_ENDPOINT}visit-requests?residentId`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          residentId: '1234',
          visitorName: 'Maling',
          visitDate: new Date().setHours(0, 0, 0, 0),
          inviteToken: 'inviteToken',
          requestStatus: 'PENDING',
        },
        {
          residentId: '1234',
          visitorName: 'Molang',
          visitDate: new Date().setHours(0, 0, 0, 0),
          inviteToken: 'inviteToken',
          requestStatus: 'PENDING',
        },
      ]),
    )
  }),
]
