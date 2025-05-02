import { RestHandler, rest } from 'msw'

const API_ENDPOINT = process.env.VUE_APP_API_ENDPOINT
console.log('API_ENDPOINT', API_ENDPOINT)

export const getInviteByTokenHandler = (): RestHandler[] => [
  rest.get(`${API_ENDPOINT}invite/:inviteToken`, async (req, res, ctx) => {
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
