import { getAllItemsHandler } from './getAllItems'
import { getItemHandler } from './getItem'
import { putItemHandler } from './putItem'

export function getHandlers() {
  return [...getAllItemsHandler(), ...putItemHandler(), ...getItemHandler()]
}
