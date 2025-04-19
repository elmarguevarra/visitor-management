import { setupWorker } from 'msw'
import { getHandlers } from './handlers'

const worker = setupWorker(...getHandlers())

worker
  .start({
    serviceWorker: {
      url: '/mockServiceWorker.js',
      options: {
        scope: '/',
      },
    },
  })
  .then(() => {
    console.groupCollapsed('[MSW] Loaded with handlers 🎉')
    worker.printHandlers()
    console.groupEnd()
  })
  .catch((error: unknown) => {
    console.error('Failed to start mock service worker', error)
  })
