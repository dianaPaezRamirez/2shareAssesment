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
      <div className={styles.info}>
        <span className={styles.name}>{item.name}</span>
        {item.isTagged && <span className={styles.badge}>In basket</span>}
      </div>
      <div className={styles.actions}>
        <Button
          size="small"
          variant={item.isTagged ? 'secondary' : 'primary'}
          disabled={isPending}
          onClick={() => onToggleTag(item)}
          aria-label={item.isTagged ? `Take ${item.name} out of the basket` : `Put ${item.name} in the basket`}
        >
          {item.isTagged ? 'Take out' : 'Put in basket'}
        </Button>
        <Button
          size="small"
          variant="danger"
          disabled={isPending}
          onClick={() => onRemove(item.id)}
          aria-label={`Remove ${item.name}`}
        >
          Remove
        </Button>
      </div>
    </li>
  )
}
