import { RestHandler, rest } from 'msw'

export const sendEmailHandler = (): RestHandler[] => [
  rest.post('/api/send-email', async (req, res, ctx) => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    return res(
      ctx.status(200),
      ctx.json({
        $metadata: {
          httpStatusCode: 200,
          requestId: 'e2c102ac-4b90-440b-ba4d-0f02e09e86c4',
          attempts: 1,
          totalRetryDelay: 0,
        },
        MessageId:
          '010e019875b946a4-1f9191ab-66fa-441a-a003-1ff41ffe33c2-000000',
      }),
    )
  }),
]
