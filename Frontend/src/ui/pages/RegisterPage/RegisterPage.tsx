import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { z } from "zod";
import { ApplicationError, getErrorMessage } from "@/application/errors/applicationError";
import { registrationSchema } from "@/domain/auth/authSchemas";
import { Alert } from "@/ui/components/Alert/Alert";
import { AuthCard } from "@/ui/components/AuthCard/AuthCard";
import { Button } from "@/ui/components/Button/Button";
import { FormField } from "@/ui/components/FormField/FormField";
import { useAuth } from "@/ui/hooks/useAuth";
import styles from "@/ui/pages/authForm.module.scss";

const registerFormSchema = registrationSchema
  .extend({
    confirmPassword: z.string().min(1, "Confirm your password."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    error: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export function RegisterPage() {
  const { register: registerUser } = useAuth();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerFormSchema),
    defaultValues: { username: "", fullName: "", password: "", confirmPassword: "" },
  });

  const onSubmit = handleSubmit(async ({ username, fullName, password }) => {
    try {
      await registerUser({ username, fullName, password });
    } catch (error) {
      if (error instanceof ApplicationError && error.kind === "conflict") {
        setError("username", { message: error.message }, { shouldFocus: true });
        return;
      }
      setError("root.server", { message: getErrorMessage(error) });
    }
  });

  return (
    <AuthCard
      title="Create your account"
      subtitle="Start your own grocery list."
      footer={
        <>
          Already have an account? <Link to="/login">Log in</Link>
        </>
      }
    >
      <title>Sign up · Grocery List</title>
      <form className={styles.form} onSubmit={onSubmit} noValidate>
        {errors.root?.server?.message && <Alert message={errors.root.server.message} />}
        <FormField label="Username" autoComplete="username" error={errors.username?.message} {...register("username")} />
        <FormField label="Full name" autoComplete="name" error={errors.fullName?.message} {...register("fullName")} />
        <FormField label="Password" type="password" autoComplete="new-password" error={errors.password?.message} {...register("password")} />
        <FormField label="Confirm password" type="password" autoComplete="new-password" error={errors.confirmPassword?.message} {...register("confirmPassword")} />
        <Button type="submit" fullWidth isLoading={isSubmitting}>
          {isSubmitting ? "Creating account…" : "Sign up"}
        </Button>
      </form>
    </AuthCard>
  );
}
