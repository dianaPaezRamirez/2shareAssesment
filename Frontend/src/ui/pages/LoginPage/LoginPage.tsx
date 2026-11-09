import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { getErrorMessage } from '@/application/errors/applicationError'
import { loginSchema } from '@/domain/auth/authSchemas'
import { Alert } from '@/ui/components/Alert/Alert'
import { AuthCard } from '@/ui/components/AuthCard/AuthCard'
import { Button } from '@/ui/components/Button/Button'
import { FormField } from '@/ui/components/FormField/FormField'
import { useAuth } from '@/ui/hooks/useAuth'
import styles from '@/ui/pages/authForm.module.scss'

export function LoginPage() {
  const { login } = useAuth()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  })

  const onSubmit = handleSubmit(async (credentials) => {
    try {
      await login(credentials)
    } catch (error) {
      setError('root.server', { message: getErrorMessage(error) })
    }
  })

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to see your grocery list."
      footer={
        <>
          Don't have an account? <Link to="/register">Sign up</Link>
        </>
      }
    >
      <title>Log in · Grocery List</title>
      <form className={styles.form} onSubmit={onSubmit} noValidate>
        {errors.root?.server?.message && <Alert message={errors.root.server.message} />}
        <FormField label="Username" autoComplete="username" error={errors.username?.message} {...register('username')} />
        <FormField
          label="Password"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <Button type="submit" fullWidth isLoading={isSubmitting}>
          {isSubmitting ? 'Logging in…' : 'Log in'}
        </Button>
      </form>
    </AuthCard>
  )
}
