"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, MessageSquare, User } from "lucide-react";

export function BottomNav({ role }: { role: "siswa" | "guru" }) {
  const pathname = usePathname();

  const items =
    role === "siswa"
      ? [
          { href: "/siswa/home", label: "Beranda", icon: House },
          { href: "/siswa/chat", label: "Chat", icon: MessageSquare },
          { href: "/siswa/akun", label: "Akun", icon: User },
        ]
      : [
          { href: "/guru/chat", label: "Chat", icon: MessageSquare },
          { href: "/guru/akun", label: "Akun", icon: User },
        ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 shrink-0 px-5 pb-[calc(env(safe-area-inset-bottom)+14px)]">
      <ul className="flex items-center justify-around rounded-full bg-white px-3 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-label={label}
                aria-current={active ? "page" : undefined}
                className="flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <span
                  className={`flex size-11 items-center justify-center rounded-full transition-all ${
                    active
                      ? "bg-gradient-to-br from-brand-300 via-brand to-brand-600 text-white shadow-[0_6px_14px_rgba(22,122,255,0.45)]"
                      : "text-ink/35"
                  }`}
                >
                  <Icon size={20} strokeWidth={2.3} />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
