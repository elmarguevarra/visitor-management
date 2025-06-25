import { RestHandler, rest } from 'msw'

export const putInviteLinkHandler = (): RestHandler[] => [
  rest.post('/invite', async (req, res, ctx) => {
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
]
