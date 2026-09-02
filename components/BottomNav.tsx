"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav({ role }: { role: "siswa" | "guru" }) {
  const pathname = usePathname();

  const items =
    role === "siswa"
      ? [
          { href: "/siswa/home", label: "Beranda", icon: Home },
          { href: "/siswa/chat", label: "Chat", icon: MessageCircle },
          { href: "/siswa/akun", label: "Akun", icon: User },
        ]
      : [
          { href: "/guru/chat", label: "Chat", icon: MessageCircle },
          { href: "/guru/akun", label: "Akun", icon: User },
        ];

  return (
    <nav className="sticky bottom-0 flex border-t bg-background">
      {items.map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-2 text-xs",
              active ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
