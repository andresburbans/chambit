"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Briefcase, LayoutGrid, User } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Logo } from "@/components/layout/logo"
import { UserNav } from "@/components/auth/user-nav"
import { useAuth } from "@/lib/auth.tsx"
import { Button } from "@/components/ui/button"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  
  if (loading) {
      return <div>Loading...</div> // Or a proper skeleton loader
  }

  if (!user) {
      // In a real app, you'd probably use middleware to protect this route.
      // For now, we'll just show a message.
      return (
          <div className="flex flex-col items-center justify-center h-screen">
              <p className="text-2xl font-bold">Access Denied</p>
              <p className="text-muted-foreground">Please log in to view the dashboard.</p>
              <Button asChild className="mt-4">
                  <Link href="/login">Log In</Link>
              </Button>
          </div>
      )
  }

  const navItems = user?.role === 'expert' ? [
    { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
    { href: "/dashboard/opportunities", label: "Opportunities", icon: Briefcase },
    { href: "/dashboard/profile", label: "Profile", icon: User },
  ] : [
    { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
    { href: "/dashboard/requests", label: "My Requests", icon: Briefcase },
    { href: "/dashboard/profile", label: "Profile", icon: User },
  ];

  return (
    <SidebarProvider>
        <div className="flex min-h-screen">
            <Sidebar>
                <SidebarHeader>
                    <div className="flex items-center justify-between">
                      <Logo />
                      <SidebarTrigger className="md:hidden"/>
                    </div>
                </SidebarHeader>
                <SidebarContent>
                <SidebarMenu>
                    {navItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                        <Link href={item.href} legacyBehavior passHref>
                        <SidebarMenuButton
                            isActive={pathname === item.href}
                            tooltip={{ children: item.label }}
                        >
                            <item.icon />
                            <span>{item.label}</span>
                        </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                    ))}
                </SidebarMenu>
                </SidebarContent>
                <SidebarFooter className="hidden md:flex">
                    <UserNav />
                </SidebarFooter>
            </Sidebar>
            <main className="flex-1">
                <header className="flex h-16 items-center justify-end border-b px-4 md:hidden">
                    <UserNav />
                </header>
                <div className="p-4 sm:p-6 lg:p-8">
                    {children}
                </div>
            </main>
      </div>
    </SidebarProvider>
  )
}
