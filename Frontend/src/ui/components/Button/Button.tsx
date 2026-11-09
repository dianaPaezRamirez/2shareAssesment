import type { ComponentProps } from 'react'
import styles from './Button.module.scss'

type ButtonVariant = 'primary' | 'secondary' | 'danger'

interface ButtonProps extends ComponentProps<'button'> {
  variant?: ButtonVariant
  fullWidth?: boolean
  isLoading?: boolean
}

export function Button({
  variant = 'primary',
  fullWidth = false,
  isLoading = false,
  type = 'button',
  disabled,
  className,
  ...props
}: ButtonProps) {
  const classes = [styles.button, styles[variant], fullWidth && styles.fullWidth, className].filter(Boolean).join(' ')

  return <button type={type} className={classes} disabled={disabled || isLoading} aria-busy={isLoading} {...props} />
}
