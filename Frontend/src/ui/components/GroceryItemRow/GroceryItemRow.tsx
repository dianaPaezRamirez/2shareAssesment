import type { GroceryItem } from '@/domain/grocery/groceryItem'
import { Button } from '@/ui/components/Button/Button'
import styles from './GroceryItemRow.module.scss'

interface GroceryItemRowProps {
  item: GroceryItem
  isPending: boolean
  onToggleTag: (item: GroceryItem) => void
  onRemove: (id: string) => void
}

export function GroceryItemRow({ item, isPending, onToggleTag, onRemove }: GroceryItemRowProps) {
  return (
    <li className={item.isTagged ? `${styles.row} ${styles.tagged}` : styles.row}>
      <label className={styles.toggle}>
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={item.isTagged}
          disabled={isPending}
          onChange={() => onToggleTag(item)}
        />
        <span className={styles.name}>{item.name}</span>
      </label>
      <Button variant="danger" disabled={isPending} onClick={() => onRemove(item.id)} aria-label={`Remove ${item.name}`}>
        Remove
      </Button>
    </li>
  )
}
