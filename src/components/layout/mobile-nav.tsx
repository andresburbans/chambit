"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Briefcase, User, Bell } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth.tsx"

export function MobileNav() {
  const pathname = usePathname()
  const { user } = useAuth()
  
  const navItems = user ? [
    { href: "/", label: "Explore", icon: Home },
    user.role === 'client' 
      ? { href: "/dashboard/requests", label: "Requests", icon: Briefcase }
      : { href: "/dashboard/opportunities", label: "Jobs", icon: Briefcase },
    { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
    { href: "/dashboard/profile", label: "Profile", icon: User },
  ] : [
    { href: "/", label: "Explore", icon: Home },
    { href: "/login", label: "Login", icon: User },
  ]
  
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/login') || pathname.startsWith('/register')) {
    return null;
  }
  
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background/95 backdrop-blur-sm border-t z-40">
      <div className="flex justify-around items-center h-full">
        {navItems.map((item) => (
          <Link key={item.label} href={item.href} className={cn(
            "flex flex-col items-center justify-center gap-1 flex-1 text-muted-foreground p-1 rounded-md",
            (pathname === item.href) && "text-primary bg-primary/10"
          )}>
            <item.icon className="w-6 h-6" />
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
