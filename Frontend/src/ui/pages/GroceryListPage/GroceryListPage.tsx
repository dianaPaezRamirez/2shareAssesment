import { Alert } from '@/ui/components/Alert/Alert'
import { AddItemForm } from '@/ui/components/AddItemForm/AddItemForm'
import { AppHeader } from '@/ui/components/AppHeader/AppHeader'
import { GroceryItemRow } from '@/ui/components/GroceryItemRow/GroceryItemRow'
import { useAuth } from '@/ui/hooks/useAuth'
import { useGroceryList } from '@/ui/hooks/useGroceryList'
import styles from './GroceryListPage.module.scss'

export function GroceryListPage() {
  const { user, logout } = useAuth()
  const { items, isLoading, error, isPending, addItem, removeItem, toggleTag, dismissError } = useGroceryList()
  const taggedCount = items.filter((item) => item.isTagged).length

  return (
    <>
      <title>My list · Grocery List</title>
      <AppHeader fullName={user?.fullName ?? ''} onLogout={logout} />
      <main className={styles.page}>
        <section className={styles.card}>
          <header className={styles.header}>
            <h1>My grocery list</h1>
            {items.length > 0 && (
              <p className={styles.summary}>
                {taggedCount} of {items.length} in the basket
              </p>
            )}
          </header>

          <AddItemForm onAdd={addItem} />

          {error && <Alert message={error} onDismiss={dismissError} />}

          {isLoading ? (
            <p className={styles.message} role="status">
              Loading your list…
            </p>
          ) : items.length === 0 ? (
            <p className={styles.message}>Your list is empty. Add the first product above.</p>
          ) : (
            <ul className={styles.list}>
              {items.map((item) => (
                <GroceryItemRow
                  key={item.id}
                  item={item}
                  isPending={isPending(item.id)}
                  onToggleTag={toggleTag}
                  onRemove={removeItem}
                />
              ))}
            </ul>
          )}
        </section>
      </main>
    </>
  )
}
