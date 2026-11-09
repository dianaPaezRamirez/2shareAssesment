import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { GROCERY_ITEM_NAME_MAX_LENGTH, newGroceryItemSchema, type NewGroceryItem } from '@/domain/grocery/groceryItem'
import { Button } from '@/ui/components/Button/Button'
import { FormField } from '@/ui/components/FormField/FormField'
import styles from './AddItemForm.module.scss'

interface AddItemFormProps {
  onAdd: (item: NewGroceryItem) => Promise<boolean>
}

export function AddItemForm({ onAdd }: AddItemFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(newGroceryItemSchema),
    defaultValues: { name: '' },
  })

  const onSubmit = handleSubmit(async (item) => {
    if (await onAdd(item)) {
      reset()
      setFocus('name')
    }
  })

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <FormField
        className={styles.field}
        label="Product"
        placeholder="e.g. Milk"
        autoComplete="off"
        maxLength={GROCERY_ITEM_NAME_MAX_LENGTH}
        error={errors.name?.message}
        {...register('name')}
      />
      <Button type="submit" className={styles.submit} isLoading={isSubmitting}>
        Add
      </Button>
    </form>
  )
}
