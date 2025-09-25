import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div>
        <h2 className="text-center text-xl font-semibold text-foreground mb-6">
            Sign in to your account
        </h2>
        <LoginForm />
    </div>
  )
}
