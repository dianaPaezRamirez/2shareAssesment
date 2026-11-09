import styles from './Alert.module.scss'

interface AlertProps {
  message: string
  onDismiss?: () => void
}

export function Alert({ message, onDismiss }: AlertProps) {
  return (
    <div role="alert" className={styles.alert}>
      <p>{message}</p>
      {onDismiss && (
        <button type="button" className={styles.dismiss} onClick={onDismiss} aria-label="Dismiss message">
          ×
        </button>
      )}
    </div>
  )
}
