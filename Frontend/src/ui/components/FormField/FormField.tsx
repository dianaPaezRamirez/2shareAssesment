import type { ComponentProps } from 'react'
import styles from './FormField.module.scss'

interface FormFieldProps extends ComponentProps<'input'> {
  label: string
  error?: string
}

export function FormField({ label, error, id, name, className, ...inputProps }: FormFieldProps) {
  const inputId = id ?? name
  const errorId = `${inputId}-error`

  return (
    <div className={[styles.field, className].filter(Boolean).join(' ')}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
      <input
        id={inputId}
        name={name}
        className={error ? `${styles.input} ${styles.invalid}` : styles.input}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...inputProps}
      />
      {error && (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  )
}
