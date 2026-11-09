import { z } from 'zod'
import type { GroceryItemRepository } from '@/application/ports/groceryItemRepository'
import type { HttpClient } from '@/infrastructure/http/httpClient'

const BASE_PATH = '/api/grocery-items'

const groceryItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  isTagged: z.boolean(),
  createdAt: z.string(),
})

const itemPath = (id: string) => `${BASE_PATH}/${encodeURIComponent(id)}`

export function createHttpGroceryItemRepository(http: HttpClient): GroceryItemRepository {
  return {
    getAll: () => http.get(BASE_PATH, z.array(groceryItemSchema)),
    add: (item) => http.post(BASE_PATH, item, groceryItemSchema),
    remove: (id) => http.delete(itemPath(id)),
    tag: (id) => http.patch(`${itemPath(id)}/tag`, groceryItemSchema),
    untag: (id) => http.patch(`${itemPath(id)}/untag`, groceryItemSchema),
  }
}
