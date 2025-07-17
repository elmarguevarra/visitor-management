import { RestHandler, rest } from 'msw'

export const putVisitRequestHandler = (): RestHandler[] => [
  rest.post('visit-request', async (req, res, ctx) => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    return res(
      ctx.status(200),
      ctx.json({
        residentId: '1234',
        visitorName: 'Maling',
        visitDate: new Date(new Date().setDate(new Date().getDate() + 1)),
        inviteToken: 'inviteToken',
        requestStatus: 'PENDING',
      }),
    )
  }),
]
