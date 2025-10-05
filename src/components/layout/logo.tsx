import Link from 'next/link';
import Image from 'next/image';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 group" aria-label="Chambit services Home">
      <div className=" ">
        <Image src="/LogoChambi-green.png" alt="Chambit Logo" width={40} height={40} className="h-8 w-8 sm:h-10 sm:w-10" />
      </div>
      <span className="font-bold text-3xl text-foreground hidden sm:inline-block">Chambit</span>
    </Link>
  );
}
