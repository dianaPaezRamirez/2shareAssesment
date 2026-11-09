import type { GroceryItem, NewGroceryItem } from '@/domain/grocery/groceryItem'

export interface GroceryItemRepository {
  getAll(): Promise<GroceryItem[]>
  add(item: NewGroceryItem): Promise<GroceryItem>
  remove(id: string): Promise<void>
  tag(id: string): Promise<GroceryItem>
  untag(id: string): Promise<GroceryItem>
}
