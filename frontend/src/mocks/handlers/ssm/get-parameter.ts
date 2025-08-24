import { RestHandler, rest } from 'msw'

export const getParameterHandler = (): RestHandler[] => [
  rest.get('/api/ssm-parameter', async (req, res, ctx) => {
    const param = req.url.searchParams.get('param')

    await new Promise((resolve) => setTimeout(resolve, 1500))

    return res(
      ctx.status(200),
      ctx.json({
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sendEmailNotifications: 'false', // mock value
        }),
        isBase64Encoded: false,
      }),
    )
  }),
]
