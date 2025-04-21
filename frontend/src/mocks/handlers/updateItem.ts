import { RestHandler, rest } from 'msw'

const API_ENDPOINT = process.env.VUE_APP_API_ENDPOINT
console.log('API_ENDPOINT', API_ENDPOINT)

export const updateItemHandler = (): RestHandler[] => [
  rest.put(`${API_ENDPOINT}`, async (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        registrationId: '2fb3plj5xef',
        arrivalTime: new Date().toISOString(),
        hasArrived: true,
      })
    )
  }),
]
