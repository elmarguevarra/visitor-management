import { RestHandler, rest } from 'msw'

export const sendEmailHandler = (): RestHandler[] => [
  rest.post('/send-email', async (req, res, ctx) => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    return res(ctx.status(200), ctx.json({}))
  }),
]
