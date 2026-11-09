import { Button } from '@/ui/components/Button/Button'
import styles from './AppHeader.module.scss'

interface AppHeaderProps {
  fullName: string
  onLogout: () => void
}

export function AppHeader({ fullName, onLogout }: AppHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <span className={styles.brand}>
          <img src="/favicon.svg" alt="" width={28} height={28} />
          Grocery List
        </span>
        <div className={styles.user}>
          <span className={styles.greeting}>Hi, {fullName}</span>
          <Button variant="secondary" onClick={onLogout}>
            Log out
          </Button>
        </div>
      </div>
    </header>
  )
}
