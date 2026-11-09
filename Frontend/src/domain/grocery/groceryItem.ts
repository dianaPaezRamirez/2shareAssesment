import { z } from 'zod'

export const GROCERY_ITEM_NAME_MAX_LENGTH = 100

export interface GroceryItem {
  id: string
  name: string
  isTagged: boolean
  createdAt: string
}

export const newGroceryItemSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Enter a product name.')
    .max(GROCERY_ITEM_NAME_MAX_LENGTH, `Product name must have at most ${GROCERY_ITEM_NAME_MAX_LENGTH} characters.`),
})

export type NewGroceryItem = z.infer<typeof newGroceryItemSchema>
