import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { createClient } from "@/lib/supabase/server";

const KODE_KHUSUS: Record<string, string> = {
  "Matematika Tingkat Lanjut": "Mat TL",
  "Matematika Wajib": "Mat Wajib",
};

function subjectCode(nama: string) {
  if (KODE_KHUSUS[nama]) return KODE_KHUSUS[nama];
  const kata = nama.trim().split(/\s+/);
  if (kata.length === 1) return kata[0].slice(0, 3).toUpperCase();
  return kata.map((k) => k[0]).join("").toUpperCase();
}

export default async function SiswaHomePage() {
  const siswa = { nama: "Sahabat TKA" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase.from("profiles_siswa").select("jenjang").eq("id", user.id).maybeSingle()
    : { data: null };

  const subjectsQuery = supabase.from("subjects").select("id, nama").order("nama");
  const { data: subjectRows } = profile?.jenjang
    ? await subjectsQuery.eq("jenjang", profile.jenjang)
    : await subjectsQuery;

  const SUBJECTS = (subjectRows ?? []).map((s) => ({
    id: s.id,
    kode: subjectCode(s.nama),
    nama: s.nama,
  }));

  const { data: guruRows } = await supabase
    .from("profiles_guru")
    .select("id, nama, rating_avg, avatar_url, guru_subjects(subjects(nama))")
    .order("rating_avg", { ascending: false })
    .limit(10);

  const GURU_ONLINE = (guruRows ?? []).map((g) => {
    const mapelUtama = g.guru_subjects?.[0]?.subjects as unknown as { nama: string } | null;
    return {
      id: g.id,
      nama: g.nama,
      mapel: mapelUtama?.nama ?? "-",
      rating: (g.rating_avg ?? 0).toFixed(1).replace(".", ","),
      avatarUrl: g.avatar_url as string | null,
    };
  });

  return (
    <div className="flex min-h-dvh flex-col bg-ground font-body text-ink">
      <div className="flex-1 overflow-y-auto pb-[calc(env(safe-area-inset-bottom)+82px)]">
        {/* HERO — poster merah, semuanya flush left, tanpa radius */}
        <header className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand to-brand-300 px-5 pb-6 pt-14 text-white">
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
            <span className="font-heading text-[12px] font-extrabold uppercase tracking-[0.18em]">
              Halo, {siswa.nama}
            </span>

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
                href={SUBJECTS[0] ? `/siswa/guru/${SUBJECTS[0].id}` : "/siswa/home"}
                className="flex shrink-0 items-center gap-2 rounded-2xl bg-white px-4 py-3 font-heading text-[13px] font-extrabold text-brand transition-colors hover:bg-brand-100 active:bg-brand-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Mulai
                <ArrowRight size={15} strokeWidth={2.6} />
              </Link>
            </div>
          </div>
        </header>

        {/* GURU ONLINE — strip horizontal */}
        <section>
          <div className="flex items-baseline justify-between px-5 pb-2.5 pt-5">
            <h2 className="font-heading text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-brand">
              Online sekarang
            </h2>
            <Link href="/siswa/guru" className="text-[11px] font-semibold text-ink/50">
              Lihat semua
            </Link>
          </div>

          <ul className="mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1">
            {GURU_ONLINE.map((g) => (
              <li
                key={g.id}
                className="w-[132px] shrink-0 snap-start rounded-2xl bg-white p-3 shadow-sm"
              >
                <Link href={`/siswa/guru/detail/${g.id}`} className="block">
                  <div className="relative h-[76px] w-full overflow-hidden rounded-xl bg-neutral-300">
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

          <ul className="mx-5 mb-7 grid grid-cols-3 gap-2">
            {SUBJECTS.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/siswa/guru/${s.id}`}
                  className="flex h-full flex-col rounded-2xl bg-white px-2.5 py-3 shadow-sm transition-colors hover:bg-brand-100 active:bg-brand-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
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
