import type { GroceryItem, NewGroceryItem } from '@/domain/grocery/groceryItem'
import type { GroceryItemRepository } from '@/application/ports/groceryItemRepository'

export interface GroceryListUseCases {
  getItems(): Promise<GroceryItem[]>
  addItem(item: NewGroceryItem): Promise<GroceryItem>
  removeItem(id: string): Promise<void>
  toggleTag(item: GroceryItem): Promise<GroceryItem>
}

export function createGroceryListUseCases(repository: GroceryItemRepository): GroceryListUseCases {
  return {
    getItems: () => repository.getAll(),
    addItem: (item) => repository.add(item),
    removeItem: (id) => repository.remove(id),
    toggleTag: (item) => (item.isTagged ? repository.untag(item.id) : repository.tag(item.id)),
  }
}
