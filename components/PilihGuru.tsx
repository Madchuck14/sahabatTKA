"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";

type Guru = {
  id: string;
  nama: string;
  tahunMengajar: number;
  jenjang: string;
  rating: string;
  reviews: number;
  online: boolean;
  avatarUrl: string | null;
};

const FILTERS = ["Semua", "Online sekarang", "Rating tertinggi"] as const;
type Filter = (typeof FILTERS)[number];

export function PilihGuru({
  subjectId,
  namaMapel,
  guru,
}: {
  subjectId: string;
  namaMapel: string;
  guru: Guru[];
}) {
  const [filter, setFilter] = useState<Filter>("Semua");
  const onlineCount = guru.filter((g) => g.online).length;

  const daftar =
    filter === "Online sekarang"
      ? guru.filter((g) => g.online)
      : filter === "Rating tertinggi"
        ? [...guru].sort((a, b) => Number(b.rating.replace(",", ".")) - Number(a.rating.replace(",", ".")))
        : guru;

  return (
    <div className="flex min-h-dvh flex-col bg-ground font-body text-ink">
      <header className="relative shrink-0 overflow-hidden bg-gradient-to-br from-brand-600 via-brand to-brand-300 px-5 pb-[18px] pt-16 text-white">
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full opacity-40"
          viewBox="0 0 400 260"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0,90 C110,150 290,10 400,70 L400,0 L0,0 Z" fill="#003BA3" fillOpacity="0.5" />
          <path d="M0,260 C130,180 270,260 400,190 L400,260 Z" fill="#0051D4" fillOpacity="0.5" />
        </svg>

        <div className="relative">
          <Link href="/siswa/home" aria-label="Kembali ke beranda" className="flex items-center gap-2.5">
            <ChevronLeft size={18} strokeWidth={2.6} />
            <span className="text-[11px] font-semibold opacity-90">{namaMapel}</span>
          </Link>
          <h1 className="mt-3.5 font-heading text-[28px] font-black leading-[1.05] -tracking-[0.02em]">
            Guru
            <br />
            {namaMapel}
          </h1>
          <div className="my-3 h-0.5 bg-white/50" />
          <p className="text-[12.5px] leading-snug text-white/90">
            {guru.length} guru tersedia · {onlineCount} online sekarang
          </p>
        </div>
      </header>

      <div className="flex shrink-0 gap-2 overflow-x-auto px-5 py-3.5">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`min-h-11 whitespace-nowrap rounded-2xl px-3 font-heading text-[11px] font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
              filter === f
                ? "bg-brand font-extrabold text-white"
                : "bg-brand-100 hover:bg-brand-200"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <ul className="flex-1 overflow-y-auto px-2.5">
        {daftar.map((g) => (
          <li key={g.id}>
            <Link
              href={`/siswa/chat/new?guruId=${g.id}&subjectId=${subjectId}`}
              className="flex items-center gap-3.5 rounded-2xl px-2.5 py-3 transition-colors hover:bg-brand-100 active:bg-brand-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <div className="relative size-[52px] shrink-0">
                <div
                  className={`relative size-full overflow-hidden rounded-full bg-neutral-300 ${g.online ? "" : "opacity-55"}`}
                >
                  {g.avatarUrl && (
                    <Image
                      src={g.avatarUrl}
                      alt={g.nama}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  )}
                </div>
                <span
                  className={`absolute bottom-0 right-0 size-3.5 rounded-full ring-2 ring-white ${g.online ? "bg-brand" : "bg-ink/30"}`}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-heading text-[14.5px] font-bold leading-tight">
                  {g.nama}
                </p>
                <p className="mt-1 truncate text-[12.5px] leading-snug text-ink/55">
                  Mengajar {g.tahunMengajar} tahun · {g.jenjang}
                </p>
                <div className="mt-1.5 flex items-center gap-2.5">
                  <span className="font-heading text-[11.5px] font-extrabold text-brand">
                    {g.rating} ★
                  </span>
                  <span className="text-[11px] text-ink/45">{g.reviews} review</span>
                </div>
              </div>
              <span className="shrink-0 rounded-full bg-brand px-3 py-1.5 font-heading text-[10.5px] font-extrabold tracking-[0.04em] text-white">
                Chat
              </span>
            </Link>
          </li>
        ))}
        {daftar.length === 0 && (
          <li className="px-5 py-8 text-center text-[12px] leading-relaxed text-ink/55">
            Belum ada guru online. Kirim pesan, nanti dibalas.
          </li>
        )}
        <li className="px-5 py-[18px] pb-6 text-[12px] leading-relaxed text-ink/50">
          Rating dihitung dari review siswa setelah konsultasi selesai.
        </li>
      </ul>
    </div>
  );
}
