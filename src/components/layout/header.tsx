"use client"
import Link from "next/link"
import { useAuth } from "@/lib/auth.tsx"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/auth/user-nav"
import { Logo } from "./logo"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

export function Header() {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  if (pathname.startsWith('/dashboard')) {
    return null; // The dashboard has its own header
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[var(--header-height)] bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto flex h-full items-center justify-between">
        <Logo />
        <nav className="flex items-center gap-4">
          <div className="hidden md:flex gap-4 items-center">
            <Link href="/#explore" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Explore</Link>
            <Link href="/#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How it Works</Link>
            {user?.role === 'client' && <Link href="/dashboard/requests" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">My Requests</Link>}
            {user?.role === 'expert' && <Link href="/dashboard/opportunities" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">My Opportunities</Link>}
          </div>

          <div className="flex items-center gap-2">
            {loading ? (
              <div className="h-10 w-24 animate-pulse rounded-md bg-muted"></div>
            ) : user ? (
              <UserNav />
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Sign up</Link>
                </Button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
