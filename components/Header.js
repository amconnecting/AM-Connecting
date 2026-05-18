import Image from "next/image";
import Link from "next/link";

const navItems = [
  ["About Us", "/#about"],
  ["Events", "/#events"],
  ["Contact", "/#contact"],
  ["Find My Group", "/my-group"],
  ["Profile / Inscription", "/registration"]
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/90 bg-white/90 backdrop-blur-xl">
      <div className="container-page flex flex-wrap items-center justify-between gap-5 py-3">
        <Link href="/" className="flex items-center gap-3 font-extrabold text-navy">
          <Image src="/am-connecting-logo.png" alt="AM-Connecting logo" width={44} height={44} className="rounded-lg object-contain" />
          <span>AM-Connecting</span>
        </Link>
        <nav className="order-3 flex w-full flex-wrap justify-center gap-x-6 gap-y-3 text-sm font-bold text-navy/75 lg:order-none lg:w-auto">
          {navItems.map(([label, href]) => (
            <Link key={label} href={href} className="transition hover:text-teal">
              {label}
            </Link>
          ))}
        </nav>
        <Link href="/registration" className="button-dark">
          Start inscription
        </Link>
      </div>
    </header>
  );
}
