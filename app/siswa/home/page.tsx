import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";

// TODO: ganti dengan query Supabase — subjects where jenjang = profil.jenjang
const SUBJECTS = [
  { id: "1", kode: "FIS", nama: "Fisika" },
  { id: "2", kode: "BIO", nama: "Biologi" },
  { id: "3", kode: "KIM", nama: "Kimia" },
  { id: "4", kode: "MTL", nama: "Matematika Tingkat Lanjut" },
  { id: "5", kode: "MTW", nama: "Matematika Wajib" },
  { id: "6", kode: "BI", nama: "Bahasa Indonesia" },
];

// TODO: ganti dengan query guru online (presence/last_seen) + rating_avg
const GURU_ONLINE = [
  { id: "a", nama: "Bu Sinta W.", mapel: "Matematika", rating: "4,9" },
  { id: "b", nama: "Pak Dwi H.", mapel: "Fisika", rating: "4,8" },
  { id: "c", nama: "Bu Ayu P.", mapel: "Biologi", rating: "4,7" },
];

export default function SiswaHomePage() {
  const siswa = { nama: "Rara", kelas: "Kelas 11" };

  return (
    <div className="flex min-h-dvh flex-col bg-ground font-body text-ink">
      <div className="flex-1 overflow-y-auto">
        {/* HERO — poster merah, semuanya flush left, tanpa radius */}
        <header className="bg-brand px-5 pb-6 pt-14 text-white">
          <div className="flex items-center justify-between">
            <span className="font-heading text-[12px] font-extrabold uppercase tracking-[0.18em]">
              HaloGuru
            </span>
            <span className="text-[11px] font-semibold opacity-90">
              {siswa.nama} · {siswa.kelas}
            </span>
          </div>

          <h1 className="mt-7 font-heading text-[40px] font-black leading-[0.95] -tracking-[0.03em]">
            TEMAN
            <br />
            PERSIAPAN
            <br />
            TKA-MU
          </h1>

          <div className="my-5 h-0.5 bg-white/50" />

          <div className="flex items-center justify-between gap-3">
            <p className="max-w-[200px] text-[13px] leading-snug text-white/90">
              Buat persiapan TKA-mu jadi lebih mudah
            </p>
            <Link
              href="/siswa/guru/1"
              className="flex shrink-0 items-center gap-2 bg-white px-4 py-3 font-heading text-[13px] font-extrabold text-brand transition-colors hover:bg-brand-100 active:bg-brand-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Mulai
              <ArrowRight size={15} strokeWidth={2.6} />
            </Link>
          </div>
        </header>

        {/* GURU ONLINE — strip horizontal, foto selalu grayscale */}
        <section>
          <div className="flex items-baseline justify-between px-5 pb-2.5 pt-5">
            <h2 className="font-heading text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-brand">
              Online sekarang
            </h2>
            <Link href="/siswa/guru" className="text-[11px] font-semibold text-ink/50">
              Lihat semua
            </Link>
          </div>

          <ul className="mx-5 flex gap-0.5 overflow-x-auto border-2 border-ink bg-ink">
            {GURU_ONLINE.map((g) => (
              <li key={g.id} className="w-[132px] shrink-0 bg-white p-3">
                <Link href={`/siswa/guru/detail/${g.id}`} className="block">
                  <div className="h-[76px] w-full bg-neutral-300 grayscale" />
                  <p className="mt-2.5 font-heading text-[12.5px] font-bold leading-tight">
                    {g.nama}
                  </p>
                  <p className="mt-1 text-[11px] leading-tight text-ink/55">{g.mapel}</p>
                  <p className="mt-1.5 font-heading text-[11px] font-extrabold text-brand">
                    {g.rating} ★
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* MAPEL — grid modular 3 kolom, dipisah rule 2px */}
        <section>
          <h2 className="px-5 pb-2.5 pt-6 font-heading text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-brand">
            Mata Uji
          </h2>

          <ul className="mx-5 mb-7 grid grid-cols-3 gap-0.5 border-2 border-ink bg-ink">
            {SUBJECTS.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/siswa/guru/${s.id}`}
                  className="flex h-full flex-col bg-white px-2.5 py-3 transition-colors hover:bg-brand-100 active:bg-brand-200 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand"
                >
                  <span className="font-heading text-[20px] font-black leading-none -tracking-[0.02em]">
                    {s.kode}
                  </span>
                  <span className="mt-1.5 text-[10.5px] leading-tight text-ink/60">
                    {s.nama}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <BottomNav role="siswa" />
    </div>
  );
}
