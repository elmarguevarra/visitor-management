import { getUserItemsHandler } from './getUserItems'
import { getItemHandler } from './getItem'
import { putItemHandler } from './putItem'

export function getHandlers() {
  return [
    ...getUserItemsHandler(),
    ...putItemHandler(),
    ...getItemHandler()  
  ]
}
