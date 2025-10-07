"use client";

import Link from "next/link";
import Image from "next/image";

export function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-white border-t">
            <div className="mx-auto max-w-6xl px-4 py-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    {/* Marca + tagline */}
                    <div className="flex items-center gap-3">
                        {/* Logo en grises (aplico filtro, no necesitas archivo extra) */}
                        <Image
                            src="/LogoChambi-green.png"
                            alt="Chambit"
                            width={36}
                            height={36}
                            className="h-9 w-9 select-none grayscale opacity-80"
                            priority
                        />
                        <span className="text-sm text-[#6b7280]">
                            Hecho con{" "}
                            <Image
                                src="/brand/heart-colombia.png"
                                alt="Corazón Colombia"
                                width={16}
                                height={16}
                                className="inline-block align-[-2px]"
                            /> en LATAM
                        </span>
                    </div>

                    {/* Navegación legal */}
                    <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#0f0f0f]">
                        <Link className="hover:text-[#79E576] transition-colors" href="/derechos-reservados-2025">
                            Derechos reservados {year}
                        </Link>
                        <span className="inline-block w-px h-4 bg-gray-200" />
                        <Link className="hover:text-[#79E576] transition-colors" href="/terminos">
                            Términos y condiciones
                        </Link>
                        <span className="inline-block w-px h-4 bg-gray-200" />
                        <Link className="hover:text-[#79E576] transition-colors" href="/privacidad">
                            Política de privacidad
                        </Link>
                        <span className="inline-block w-px h-4 bg-gray-200" />
                        <Link className="hover:text-[#79E576] transition-colors" href="/autorizacion-datos">
                            Autorización para procesamiento de datos
                        </Link>
                        <span className="inline-block w-px h-4 bg-gray-200" />
                        <Link className="hover:text-[#79E576] transition-colors" href="/terminus/proyecto/contactanos">
                            Contáctanos
                        </Link>
                    </nav>
                </div>
            </div>
        </footer>
    );
}