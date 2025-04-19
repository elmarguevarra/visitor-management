import { getAllItemsHandler } from './getAllItems'

export function getHandlers() {
  return [...getAllItemsHandler()]
}
