import { RestHandler, rest } from 'msw'

const API_ENDPOINT = process.env.VUE_APP_API_ENDPOINT
console.log('API_ENDPOINT', API_ENDPOINT)

export const getVisitRequestByTokenHandler = (): RestHandler[] => [
  rest.get(
    `${API_ENDPOINT}visit-request/:inviteToken`,
    async (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          residentId: '1234',
          inviteToken: 'token',
          visitorName: 'visitorName',
          visitDate: new Date(),
          requestStatus: 'PENDING',
        }),
      )
    },
  ),
]
