"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/proofs#proof-grid", id: "explore", icon: "△", label: "Explore" },
  { href: "/proofs", id: "proofs", icon: "♧", label: "Proofs" },
  { href: "/proofs#catalog-title", id: "practice", icon: "◇", label: "Practice" },
  { href: "/proofs#how-it-works", id: "saved", icon: "▱", label: "How it works" },
] as const;

export default function ProofMainMenu() {
  const pathname = usePathname();
  const onLibrary = pathname === "/proofs";

  return (
    <aside className="sidebar proof-main-menu" aria-label="Primary navigation">
      <Link href="/proofs" className="menu-brand" aria-label="Maths Universe home">
        <span className="brand-mark">✣</span>
        <span className="brand">
          MATHS
          <br />
          UNIVERSE
        </span>
      </Link>
      <nav className="side-nav">
        {ITEMS.map((item) => {
          const active =
            item.id === "proofs"
              ? pathname.startsWith("/proofs") ||
                pathname.startsWith("/visual-proofs")
              : item.id === "explore" && onLibrary;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`side-item${active ? " active" : ""}`}
              aria-current={active ? "page" : undefined}
            >
              <span className="side-icon">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <Link href="/proofs" className="side-item settings">
        <span className="side-icon">⚙</span>
        Settings
      </Link>
    </aside>
  );
}
