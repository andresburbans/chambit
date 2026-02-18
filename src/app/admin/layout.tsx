"use client"

import { ReactNode } from "react"
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import { LayoutDashboard, Map as MapIcon, Users, Settings, Tag } from "lucide-react"
import Link from "next/link"
import { Logo } from "@/components/layout/logo"
import { usePathname } from "next/navigation"

export default function AdminLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname()

    const menuItems = [
        { icon: LayoutDashboard, label: "Analytics", href: "/admin" },
        { icon: MapIcon, label: "Geozones", href: "/admin/geozones" },
        { icon: Users, label: "Experts", href: "/admin/experts" },
        { icon: Tag, label: "Categories", href: "/admin/categories" },
        { icon: Settings, label: "Settings", href: "/admin/settings" },
    ]

    return (
        <SidebarProvider>
            <div className="flex min-h-screen bg-[#f8f9fa]">
                <Sidebar className="border-r border-gray-200 bg-white shadow-sm">
                    <SidebarHeader className="p-6">
                        <Logo />
                        <div className="mt-1 text-[10px] font-bold tracking-widest text-[#34af00] uppercase opacity-60">
                            Admin Portal
                        </div>
                    </SidebarHeader>
                    <SidebarContent className="px-3">
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <SidebarMenuItem key={item.label}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === item.href}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${pathname === item.href
                                                ? "bg-green-50 text-[#34af00] font-semibold"
                                                : "text-gray-500 hover:bg-gray-50 hover:text-black"
                                            }`}
                                    >
                                        <Link href={item.href}>
                                            <item.icon className={`h-5 w-5 ${pathname === item.href ? "text-[#34af00]" : "opacity-70"}`} />
                                            <span>{item.label}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarContent>
                </Sidebar>

                <main className="flex-1 overflow-auto">
                    {/* Admin Top Header */}
                    <header className="h-16 border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-8">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                            <span>Chambit</span>
                            <span>/</span>
                            <span className="text-black capitalize">{pathname.split('/').pop() || 'Analytics'}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            {/* Admin Status/Profile Placeholder */}
                            <div className="h-8 w-8 rounded-full bg-[#34af00] flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
                                AD
                            </div>
                        </div>
                    </header>

                    {/* Content Area */}
                    <div className="p-8">
                        {children}
                    </div>
                </main>
            </div>
        </SidebarProvider>
    )
}
