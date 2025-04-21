import { getUserItemsHandler } from './getUserItems'
import { getItemHandler } from './getItem'
import { putItemHandler } from './putItem'
import { updateItemHandler } from './updateItem'

export function getHandlers() {
  return [
    ...getUserItemsHandler(),
    ...putItemHandler(),
    ...getItemHandler(),
    ...updateItemHandler(),
  ]
}
