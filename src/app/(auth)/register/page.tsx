import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div>
        <h2 className="text-center text-xl font-semibold text-foreground mb-6">
            Create your account
        </h2>
        <RegisterForm />
    </div>
  )
}
