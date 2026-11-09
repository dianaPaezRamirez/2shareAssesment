import { useCallback, useEffect, useState } from 'react'
import { ApplicationError, getErrorMessage } from '@/application/errors/applicationError'
import type { GroceryItem, NewGroceryItem } from '@/domain/grocery/groceryItem'
import { groceryListUseCases } from '@/dependencies'

export function useGroceryList() {
  const [items, setItems] = useState<GroceryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pendingIds, setPendingIds] = useState<ReadonlySet<string>>(new Set())

  useEffect(() => {
    let ignore = false

    groceryListUseCases
      .getItems()
      .then((loadedItems) => {
        if (!ignore) setItems(loadedItems)
      })
      .catch((loadError: unknown) => {
        if (!ignore) setError(getErrorMessage(loadError))
      })
      .finally(() => {
        if (!ignore) setIsLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [])

  const addItem = useCallback(async (item: NewGroceryItem): Promise<boolean> => {
    setError(null)
    try {
      const createdItem = await groceryListUseCases.addItem(item)
      setItems((current) => [...current, createdItem])
      return true
    } catch (addError) {
      setError(getErrorMessage(addError))
      return false
    }
  }, [])

  const runItemAction = useCallback(async (id: string, action: () => Promise<void>) => {
    setError(null)
    setPendingIds((current) => new Set(current).add(id))
    try {
      await action()
    } catch (actionError) {
      if (actionError instanceof ApplicationError && actionError.kind === 'notFound') {
        setItems((current) => current.filter((item) => item.id !== id))
      }
      setError(getErrorMessage(actionError))
    } finally {
      setPendingIds((current) => {
        const next = new Set(current)
        next.delete(id)
        return next
      })
    }
  }, [])

  const removeItem = useCallback(
    (id: string) =>
      runItemAction(id, async () => {
        await groceryListUseCases.removeItem(id)
        setItems((current) => current.filter((item) => item.id !== id))
      }),
    [runItemAction],
  )

  const toggleTag = useCallback(
    (item: GroceryItem) =>
      runItemAction(item.id, async () => {
        const updatedItem = await groceryListUseCases.toggleTag(item)
        setItems((current) => current.map((existing) => (existing.id === updatedItem.id ? updatedItem : existing)))
      }),
    [runItemAction],
  )

  const dismissError = useCallback(() => setError(null), [])

  return {
    items,
    isLoading,
    error,
    isPending: (id: string) => pendingIds.has(id),
    addItem,
    removeItem,
    toggleTag,
    dismissError,
  }
}
