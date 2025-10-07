"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Twitter, Github, Linkedin } from "lucide-react";

export function FooterAurora() {
    const year = new Date().getFullYear();

    return (
        <footer className="footer-aurora bg-white">
            {/* Capa aurora */}
            <div className="aurora-layer">
                <span className="aurora-bubble bubble-1" />
                <span className="aurora-bubble bubble-2" />
                <span className="aurora-bubble bubble-3" />
                <span className="aurora-bubble bubble-4" />
            </div>

            {/* Contenido */}
            <div className="relative z-10 mx-auto max-w-6xl px-4 py-12 pb-4">
                {/* GRID principal: izquierda marca, derecha links */}
                <div className="grid gap-10 lg:grid-cols-12">

                    {/* ===== IZQUIERDA: MARCA ===== */}
                    <div className="flex flex-col items-center text-center lg:items-start lg:text-left lg:col-span-6 pt-6 pb-1">
                        {/* logo + Chambit (3× más grande respecto a títulos de columnas) */}
                        <div className="flex items-center gap-4">
                            <Image
                                src="/logo-chambit-text.png"
                                alt="Chambit logo text"
                                width={717}
                                height={205}
                                className="h-16 w-auto select-none "
                                priority
                            />

                        </div>

                        {/* Hecho con amor en LATAM (también grande) */}
                        <h3 className="mt-4 font-extrabold leading-tight text-4xl md:text-4xl">
                            Hecho con{" "}
                            <Image
                                src="/brand/heart-colombia.png"
                                alt="Corazón Colombia"
                                width={48}
                                height={48}
                                className="inline-block h-9 w-9 align-[-6px]"
                            />{" "} <br />
                            en Latinoamérica
                        </h3>

                        {/* Redes sociales */}
                        <div className="mt-5 flex items-center gap-5 text-[#0f0f0f]/80">
                            <a href="#" aria-label="TikTok" className="hover:text-[#79E576] transition-colors">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
                                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                                </svg>
                            </a>
                            <Link href="#" aria-label="Instagram" className="hover:text-[#79E576] transition-colors">
                                <Instagram size={26} />
                            </Link>
                            <Link href="#" aria-label="X (Twitter)" className="hover:text-[#79E576]">
                                <Twitter size={26} />
                            </Link>
                            <Link href="#" aria-label="LinkedIn" className="hover:text-[#79E576]">
                                <Linkedin size={26} />
                            </Link>
                            <Link href="#" aria-label="GitHub" className="hover:text-[#79E576]">
                                <Github size={26} />
                            </Link>
                        </div>
                    </div>

                    {/* ===== DERECHA: LINKS (2×2) ===== */}
                    <div className="lg:col-span-6 grid gap-8 sm:grid-cols-2">
                        <div className="space-y-3">
                            <h4 className="text-base font-semibold text-[#0f0f0f] tracking-wide">Para clientes</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link className="text-[#0f0f0f]/80 hover:text-[#79E576] transition-colors" href="/terminus/proyecto/sobre-nosotros">Cómo funciona Chambit</Link></li>
                                <li><Link className="text-[#0f0f0f]/80 hover:text-[#79E576]" href="/terminus">Explora categorías</Link></li>
                                <li><Link className="text-[#0f0f0f]/80 hover:text-[#79E576]" href="/dashboard/requests">Mis solicitudes</Link></li>
                                <li><Link className="text-[#0f0f0f]/80 hover:text-[#79E576]" href="/contacto">Soporte</Link></li>
                            </ul>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-base font-semibold text-[#0f0f0f] tracking-wide">Para expertos</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link className="text-[#0f0f0f]/80 hover:text-[#79E576]" href="/register">Regístrate como experto</Link></li>
                                <li><Link className="text-[#0f0f0f]/80 hover:text-[#79E576]" href="/dashboard/opportunities">Mis oportunidades</Link></li>
                                <li><Link className="text-[#0f0f0f]/80 hover:text-[#79E576]" href="/terminus/investigacion">Buenas prácticas</Link></li>
                                <li><Link className="text-[#0f0f0f]/80 hover:text-[#79E576]" href="/terminus/ciencia">Ciencia & Rangos</Link></li>
                            </ul>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-base font-semibold text-[#0f0f0f] tracking-wide">Recursos</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link className="text-[#0f0f0f]/80 hover:text-[#79E576]" href="/terminos">Términos y condiciones</Link></li>
                                <li><Link className="text-[#0f0f0f]/80 hover:text-[#79E576]" href="/privacidad">Política de privacidad</Link></li>
                                <li><Link className="text-[#0f0f0f]/80 hover:text-[#79E576]" href="/autorizacion-datos">Autorización de datos</Link></li>
                                <li><Link className="text-[#0f0f0f]/80 hover:text-[#79E576]" href="/derechos-reservados-2025">Derechos reservados</Link></li>
                            </ul>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-base font-semibold text-[#0f0f0f] tracking-wide">Compañía</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link className="text-[#0f0f0f]/80 hover:text-[#79E576]" href="/terminus/proyecto">Proyecto Chambit</Link></li>
                                <li><Link className="text-[#0f0f0f]/80 hover:text-[#79E576]" href="/terminus/noticias">Noticias</Link></li>
                                <li><Link className="text-[#0f0f0f]/80 hover:text-[#79E576]" href="/contacto">Contáctanos</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* ===== BARRA LEGAL ===== */}
                <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-sm">
                    <div className="text-[#6b7280]">
                        © 2025 Chambit — Todos los derechos reservados
                    </div>
                    <div className="flex items-center gap-4">
                        <Link className="hover:text-[#79E576] transition-colors" href="/terminos">Términos</Link>
                        <span className="inline-block w-px h-4 bg-gray-300" />
                        <Link className="hover:text-[#79E576] transition-colors" href="/privacidad">Privacidad</Link>
                        <span className="inline-block w-px h-4 bg-gray-300" />
                        <Link className="hover:text-[#79E576] transition-colors" href="/autorizacion-datos">Autorización de datos</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}