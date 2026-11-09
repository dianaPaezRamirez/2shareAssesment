import type { ReactNode } from 'react'
import styles from './AuthCard.module.scss'

interface AuthCardProps {
  title: string
  subtitle: string
  footer: ReactNode
  children: ReactNode
}

export function AuthCard({ title, subtitle, footer, children }: AuthCardProps) {
  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <header className={styles.header}>
          <img src="/favicon.svg" alt="" width={40} height={40} />
          <h1>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </header>
        {children}
        <footer className={styles.footer}>{footer}</footer>
      </section>
    </main>
  )
}
