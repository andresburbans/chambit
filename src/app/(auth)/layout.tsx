// Auth pages manage their own layout and styling.
// This layout is intentionally transparent to avoid double-wrapping.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
