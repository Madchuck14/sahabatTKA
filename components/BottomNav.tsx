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
    <nav className="shrink-0 border-t-2 border-ink bg-white pb-[calc(env(safe-area-inset-bottom)+10px)] pt-2.5">
      <ul className="flex">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-11 flex-col items-center gap-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                  active ? "text-brand" : "text-ink/45"
                }`}
              >
                <Icon size={21} strokeWidth={2.2} />
                <span
                  className={
                    active
                      ? "font-heading text-[10px] font-extrabold tracking-[0.06em]"
                      : "text-[10px] font-semibold tracking-[0.06em]"
                  }
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
