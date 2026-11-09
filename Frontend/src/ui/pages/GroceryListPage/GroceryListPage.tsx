import type { GroceryItem } from '@/domain/grocery/groceryItem'
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
  const itemsToBuy = items.filter((item) => !item.isTagged)
  const itemsInBasket = items.filter((item) => item.isTagged)

  const renderItems = (sectionItems: GroceryItem[]) => (
    <ul className={styles.list}>
      {sectionItems.map((item) => (
        <GroceryItemRow
          key={item.id}
          item={item}
          isPending={isPending(item.id)}
          onToggleTag={toggleTag}
          onRemove={removeItem}
        />
      ))}
    </ul>
  )

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
                {itemsInBasket.length} of {items.length} in the basket
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
            <>
              <section className={styles.section} aria-labelledby="to-buy-title">
                <h2 id="to-buy-title" className={styles.sectionTitle}>
                  To buy <span className={styles.count}>{itemsToBuy.length}</span>
                </h2>
                {itemsToBuy.length > 0 ? (
                  renderItems(itemsToBuy)
                ) : (
                  <p className={styles.sectionMessage}>Everything is in the basket.</p>
                )}
              </section>

              {itemsInBasket.length > 0 && (
                <section className={styles.section} aria-labelledby="in-basket-title">
                  <h2 id="in-basket-title" className={styles.sectionTitle}>
                    In the basket <span className={styles.count}>{itemsInBasket.length}</span>
                  </h2>
                  {renderItems(itemsInBasket)}
                </section>
              )}
            </>
          )}
        </section>
      </main>
    </>
  )
}
