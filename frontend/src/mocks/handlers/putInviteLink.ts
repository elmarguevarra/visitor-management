import { RestHandler, rest } from 'msw'

export const putInviteLinkHandler = (): RestHandler[] => [
  rest.post('/api/invite', async (req, res, ctx) => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    return res(
      ctx.status(200),
      ctx.json({
        residentId: '1234',
        inviteToken: 'token',
        inviteLink: 'http://localhost:8080/self-register-visitor/inviteToken',
        inviteLinkExpiration: new Date(),
      }),
    )
  }),
  // rest.post('/api/invite', (req, res, ctx) => {
  //   throw new Error('Simulated network/server failure')
  // }),
]
