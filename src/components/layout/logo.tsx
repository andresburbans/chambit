import Link from 'next/link';
import Image from 'next/image';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 group" aria-label="Chambit services Home">
      <div className=" ">
        <Image src="/logo-chambit-text.png" alt="Chambit Logo" width={717} height={205} className="h-8 w-auto sm:h-10 w-auto" />
      </div>
    </Link>
  );
}
