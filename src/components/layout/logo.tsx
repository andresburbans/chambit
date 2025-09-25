import Link from 'next/link';
import Image from 'next/image';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 group" aria-label="Chambit Connect Home">
      <div className="p-2 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-colors">
        <Image src="/LogoChambi-green.png" alt="Chambit Logo" width={24} height={24} className="h-6 w-6" />
      </div>
      <span className="font-bold text-xl text-foreground hidden sm:inline-block">Chambit</span>
    </Link>
  );
}
