"use client"
import Link from "next/link"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/auth/user-nav"
import { Logo } from "./logo"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { ChevronDown, ChevronUp, Bell, History, FileText, Briefcase } from "lucide-react"
import { useState } from "react"

export function Header() {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  if (pathname.startsWith('/dashboard')) {
    return null; // The dashboard has its own header
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[var(--header-height)] bg-white border-b">
      <div className="px-16 flex h-full items-center justify-between">
        <div className="flex items-center gap-8">
          <Logo />

          <div className="hidden md:flex gap-4 relative top-[5px]">
            <div
              className="flex items-center"
              onMouseEnter={() => setActiveMenu('recluta')}
            >
              <Link href="#" className="flex items-center gap-1 text-sm font-medium text-[#0f0f0f] hover:text-[#34af00] transition-colors">
                Recluta expertos {activeMenu === 'recluta' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Link>
            </div>
            <div
              className="flex items-center"
              onMouseEnter={() => setActiveMenu('como')}
            >
              <Link href="#" className="flex items-center gap-1 text-sm font-medium text-[#0f0f0f] hover:text-[#34af00] transition-colors">
                Cómo funciona {activeMenu === 'como' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Link>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 relative top-[5px]">
          {loading ? (
            <div className="h-10 w-24 animate-pulse rounded-md bg-muted"></div>
          ) : user ? (
            user.role === 'client' ? (
              <>
                <Button variant="ghost" size="icon" asChild><Link href="/dashboard/requests"><FileText className="h-4 w-4" /></Link></Button>
                <Button variant="ghost" size="icon" asChild><Link href="/dashboard/history"><History className="h-4 w-4" /></Link></Button>
                <Button variant="ghost" size="icon" asChild><Link href="/dashboard/notifications"><Bell className="h-4 w-4" /></Link></Button>
                <UserNav />
                <span className="text-sm text-[#0f0f0f] cursor-pointer hover:text-[#34af00]">Quiero ganar dinero</span>
              </>
            ) : user.role === 'expert' ? (
              <>
                <Button variant="ghost" size="icon" asChild><Link href="/dashboard/opportunities"><Briefcase className="h-4 w-4" /></Link></Button>
                <Button variant="ghost" size="icon" asChild><Link href="/dashboard/history"><History className="h-4 w-4" /></Link></Button>
                <Button variant="ghost" size="icon" asChild><Link href="/dashboard/notifications"><Bell className="h-4 w-4" /></Link></Button>
                <UserNav />
                <span className="text-sm text-[#0f0f0f]">Modo Experto</span>
              </>
            ) : null
          ) : (
            <>
              <Button variant="ghost" className="text-[#0f0f0f] hover:text-[#34af00]" asChild><Link href="/login">Ingresar</Link></Button>
              <Button className="bg-[#34af00] hover:bg-[#2d9600] text-white" asChild><Link href="/register">Registrarse</Link></Button>
              <span className="text-[#0f0f0f] mx-2">|</span>
              <span className="text-sm text-[#0f0f0f] cursor-pointer hover:text-[#34af00]">Soy un experto</span>
            </>
          )}
        </div>
      </div>
      {activeMenu && (
        <div
          className="absolute top-full left-0 w-full bg-white border-b border-border shadow-lg transition-all ease-in-out duration-200"
          onMouseEnter={() => { }}
          onMouseLeave={() => setActiveMenu(null)}
        >
          <div className="px-16 py-6 font-body">
            {activeMenu === 'recluta' && (
              <div
                className="grid grid-cols-3 gap-2 p-4"
              >
                <Link href="#" className="font-semibold text-sm text-[#0f0f0f] hover:text-[#34af00] transition-colors">Encontrar talento</Link>
                <Link href="#" className="font-semibold text-sm text-[#0f0f0f] hover:text-[#34af00] transition-colors">Publicar proyecto</Link>
                <Link href="#" className="font-semibold text-sm text-[#0f0f0f] hover:text-[#34af00] transition-colors">Gestionar contratos</Link>
              </div>
            )}
            {activeMenu === 'como' && (
              <div
                className="grid grid-cols-grid gap-2 p-4"
              >
                <Link href="#" className="font-semibold text-sm text-[#0f0f0f] hover:text-[#34af00] transition-colors">Para clientes</Link>
                <Link href="#" className="font-semibold text-sm text-[#0f0f0f] hover:text-[#34af00] transition-colors">Para expertos</Link>
                <Link href="#" className="font-semibold text-sm text-[#0f0f0f] hover:text-[#34af00] transition-colors">Seguridad y Precios</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
