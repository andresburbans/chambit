"use client"
import Link from "next/link"
import { useAuth } from "@/lib/auth.tsx"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/auth/user-nav"
import { Logo } from "./logo"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { ChevronDown, ChevronUp, Bell, History, FileText, Briefcase } from "lucide-react"
import { useState } from "react"
import { cienciaPosts, noticiasPosts } from "@/lib/terminus-data"

function top5Ciencia() {
  return [...cienciaPosts]
    .sort((a, b) => {
      const d = +new Date(b.dateISO) - +new Date(a.dateISO);
      if (d !== 0) return d;
      return (b.relevance ?? 0) - (a.relevance ?? 0);
    })
    .slice(0, 5);
}

function top5Noticias() {
  return [...noticiasPosts]
    .sort((a, b) => {
      const d = +new Date(b.dateISO) - +new Date(a.dateISO);
      if (d !== 0) return d;
      return (b.relevance ?? 0) - (a.relevance ?? 0);
    })
    .slice(0, 5);
}

const proyectoSubs = [
  { label: "Sobre nosotros", href: "/terminus/proyecto/sobre-nosotros" },
  { label: "Desarrolladores", href: "/terminus/proyecto/desarrolladores" },
  { label: "Directores", href: "/terminus/proyecto/directores" },
  { label: "Patrocinadores", href: "/terminus/proyecto/patrocinadores" },
  { label: "Contactanos", href: "/terminus/proyecto/contactanos" },
];

const investigacionSubs = [
  { label: "Planteamiento", href: "/terminus/investigacion/planteamiento" },
  { label: "Justificación", href: "/terminus/investigacion/justificacion" },
  { label: "Teoría", href: "/terminus/investigacion/teoria" },
  { label: "Metodología", href: "/terminus/investigacion/metodologia" },
  { label: "Cronograma", href: "/terminus/investigacion/cronograma" },
];

export function Header() {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const ciencia = top5Ciencia();
  const noticias = top5Noticias();

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
              <Link href="/building" className="flex items-center gap-1 text-sm font-medium text-[#0f0f0f] hover:text-[#34af00] transition-colors">
                Recluta expertos {activeMenu === 'recluta' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Link>
            </div>
            <div
              className="flex items-center"
              onMouseEnter={() => setActiveMenu('como')}
            >
              <Link href="/building" className="flex items-center gap-1 text-sm font-medium text-[#0f0f0f] hover:text-[#34af00] transition-colors">
                Cómo funciona {activeMenu === 'como' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Link>
            </div>
            <div
              className="flex items-center"
              onMouseEnter={() => setActiveMenu('terminus')}
            >
              <Link href="/terminus" className="flex items-center gap-1 text-sm font-medium text-[#0f0f0f] hover:text-[#34af00] transition-colors">
                Términus {activeMenu === 'terminus' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
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
                <span className="text-sm text-[#0f0f0f]">Quiero ganar dinero</span>
              </>
            ) : user.role === 'expert' ? (
              <>
                <Button variant="ghost" size="icon" asChild><Link href="/dashboard/opportunities"><Briefcase className="h-4 w-4" /></Link></Button>
                <Button variant="ghost" size="icon" asChild><Link href="/dashboard/history"><History className="h-4 w-4" /></Link></Button>
                <Button variant="ghost" size="icon" asChild><Link href="/dashboard/notifications"><Bell className="h-4 w-4" /></Link></Button>
                <UserNav />
                <span className="text-sm text-[#0f0f0f]">Experto</span>
              </>
            ) : null
          ) : (
            <>
              <Button variant="ghost" className="text-[#0f0f0f] hover:text-[#34af00]" asChild><Link href="/login">Sign in</Link></Button>
              <Button className="text-[#0f0f0f] hover:text-[#34af00]" asChild><Link href="/register">Sign up</Link></Button>
              <span className="text-[#0f0f0f] mx-2">|</span>
              <span className="text-sm text-[#0f0f0f]">Soy un experto</span>
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
          <div className="px-16 py-6">
            {activeMenu === 'recluta' && (
              <div
                className="grid grid-cols-3 gap-2 p-4"
                onMouseEnter={() => { }}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <Link href="/building/talento" className="font-semibold text-sm text-[#0f0f0f] hover:text-[#34af00] transition-colors">Encontrar talento</Link>
                <Link href="/building/proyecto" className="font-semibold text-sm text-[#0f0f0f] hover:text-[#34af00] transition-colors">Publicar proyecto</Link>
                <Link href="/building/contratos" className="font-semibold text-sm text-[#0f0f0f] hover:text-[#34af00] transition-colors">Gestionar contratos</Link>
              </div>
            )}
            {activeMenu === 'como' && (
              <div
                className="grid grid-cols-3 gap-2 p-4"
                onMouseEnter={() => { }}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <Link href="/building/clientes" className="font-semibold text-sm text-[#0f0f0f] hover:text-[#34af00] transition-colors">Para clientes</Link>
                <Link href="/building/expertos" className="font-semibold text-sm text-[#0f0f0f] hover:text-[#34af00] transition-colors">Para expertos</Link>
                <Link href="/building/precios" className="font-semibold text-sm text-[#0f0f0f] hover:text-[#34af00] transition-colors">Precios</Link>
              </div>
            )}
            {activeMenu === 'terminus' && (
              <div className="grid grid-cols-4 gap-4 p-4">
                {/* Headers */}
                <Link href="/terminus/proyecto" className="font-semibold text-sm text-[#0f0f0f] hover:text-[#34af00] transition-colors">
                  Proyecto Chambit
                </Link>
                <Link href="/terminus/investigacion" className="font-semibold text-sm text-[#0f0f0f] hover:text-[#34af00] transition-colors">
                  Investigación
                </Link>
                <Link href="/terminus/ciencia" className="font-semibold text-sm text-[#0f0f0f] hover:text-[#34af00] transition-colors">
                  Ciencia
                </Link>
                <Link href="/terminus/noticias" className="font-semibold text-sm text-[#0f0f0f] hover:text-[#34af00] transition-colors">
                  Noticias
                </Link>

                {/* Rows */}
                {proyectoSubs.map((sub, i) => (
                  <>
                    <Link key={sub.href} href={sub.href} className="text-xs text-[#0f0f0f] hover:text-[#34af00] transition-colors">
                      {sub.label}
                    </Link>
                    <Link key={investigacionSubs[i].href} href={investigacionSubs[i].href} className="text-xs text-[#0f0f0f] hover:text-[#34af00] transition-colors">
                      {investigacionSubs[i].label}
                    </Link>
                    <Link key={ciencia[i].id} href={ciencia[i].href} className="text-xs text-[#0f0f0f] hover:text-[#34af00] transition-colors truncate">
                      {ciencia[i].title}
                    </Link>
                    <Link key={noticias[i].id} href={noticias[i].href} className="text-xs text-[#0f0f0f] hover:text-[#34af00] transition-colors truncate">
                      {noticias[i].title}
                    </Link>
                  </>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

