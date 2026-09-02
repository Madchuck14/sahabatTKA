"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

type Guru = {
  id: string;
  nama: string;
  tahunMengajar: number;
  jenjang: string;
  rating: string;
  reviews: number;
  online: boolean;
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
      <header className="shrink-0 bg-brand px-5 pb-[18px] pt-16 text-white">
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
      </header>

      <div className="flex shrink-0 gap-2 overflow-x-auto px-5 py-3.5">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`min-h-11 whitespace-nowrap px-3 font-heading text-[11px] font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
              filter === f
                ? "bg-ink font-extrabold text-white"
                : "border-2 border-ink hover:bg-brand-100"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <ul className="flex-1 overflow-y-auto">
        {daftar.map((g, i) => (
          <li
            key={g.id}
            className={i === daftar.length - 1 ? "border-b-2 border-ink" : "border-b border-ink/40"}
          >
            <Link
              href={`/siswa/chat/new?guruId=${g.id}&subjectId=${subjectId}`}
              className="flex items-start gap-3.5 px-5 py-4 transition-colors hover:bg-brand-100 active:bg-brand-200 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand"
            >
              <div
                className={`size-[58px] shrink-0 bg-neutral-300 grayscale ${g.online ? "" : "opacity-55"}`}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className={`size-[7px] shrink-0 ${g.online ? "bg-brand" : "bg-ink/30"}`} />
                  <p className="font-heading text-[15px] font-bold leading-tight">{g.nama}</p>
                </div>
                <p className="mt-1.5 text-[12px] leading-snug text-ink/60">
                  Mengajar {g.tahunMengajar} tahun · {g.jenjang}
                </p>
                <div className="mt-2 flex items-center gap-2.5">
                  <span className="font-heading text-[12px] font-extrabold text-brand">
                    {g.rating} ★
                  </span>
                  <span className="text-[11.5px] text-ink/50">{g.reviews} review</span>
                </div>
              </div>
              <span className="shrink-0 border-2 border-ink px-2.5 py-2 font-heading text-[10.5px] font-extrabold tracking-[0.04em]">
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
