import Link from "next/link";
import { BottomNav } from "@/components/BottomNav";

// TODO: ganti dengan query chat_rooms join profiles_guru + pesan terakhir + unread count
const ROOMS = [
  {
    id: "r1",
    guru: "Bu Sinta Wulandari, M.Pd",
    mapel: "Matematika",
    last: "Coba kerjain nomor 4 dulu ya, nanti kirim fotonya",
    time: "09.41",
    unread: 2,
  },
  {
    id: "r2",
    guru: "Pak Dwi Handoko, M.Pd",
    mapel: "Fisika",
    last: "Kamu: makasih pak, udah paham",
    time: "Kemarin",
    unread: 0,
  },
  {
    id: "r3",
    guru: "Bu Ayu Pratiwi, S.Pd",
    mapel: "Biologi",
    last: "Nanti aku kirim rangkuman bab 3 ya",
    time: "Sen",
    unread: 0,
  },
];

export default function SiswaChatListPage() {
  const unreadTotal = ROOMS.reduce((n, r) => n + r.unread, 0);

  return (
    <div className="flex min-h-dvh flex-col bg-ground font-body text-ink">
      {/* HEADER — lanjutan bahasa hero home */}
      <header className="relative shrink-0 overflow-hidden bg-gradient-to-br from-brand-600 via-brand to-brand-300 px-5 pb-4 pt-14 text-white">
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
            Halo, Sahabat TKA
          </span>
          <h1 className="mt-5 font-heading text-[30px] font-black leading-[0.98] -tracking-[0.03em]">
            CHAT KAMU
          </h1>
          <div className="mb-3 mt-4 h-0.5 bg-white/50" />
          <p className="text-[12.5px] leading-snug text-white/90">
            {ROOMS.length} konsultasi aktif · {unreadTotal} pesan belum dibaca
          </p>
        </div>
      </header>

      {ROOMS.length > 0 ? (
        <ul className="flex-1 overflow-y-auto px-2.5 pb-[calc(env(safe-area-inset-bottom)+82px)]">
          {ROOMS.map((r) => (
            <li key={r.id}>
              <Link
                href={`/siswa/chat/${r.id}`}
                className="flex items-center gap-3 rounded-2xl px-2.5 py-3 transition-colors hover:bg-brand-100 active:bg-brand-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <div className="size-[52px] shrink-0 rounded-full bg-neutral-300" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <p className="flex-1 truncate font-heading text-[14.5px] font-bold leading-tight">
                      {r.guru}
                    </p>
                    <span className="shrink-0 text-[11px] font-semibold text-ink/45">
                      {r.time}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <p className="flex-1 truncate text-[13px] leading-snug text-ink/55">
                      {r.last}
                    </p>
                    {r.unread > 0 && (
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand text-[10.5px] font-bold text-white">
                        {r.unread}
                        <span className="sr-only"> pesan belum dibaca</span>
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </li>
          ))}
          <li className="px-2.5 py-5 text-[12px] leading-relaxed text-ink/50">
            Chat lama otomatis diarsipkan setelah 30 hari nggak ada balasan.
          </li>
        </ul>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-2.5 px-5 text-center">
          <h2 className="font-heading text-[18px] font-extrabold">Belum ada chat</h2>
          <p className="text-[12.5px] leading-snug text-ink/55">
            Pilih mapel di beranda buat mulai tanya.
          </p>
          <Link
            href="/siswa/home"
            className="mt-2 bg-brand px-4 py-3 font-heading text-[13px] font-extrabold text-white transition-colors hover:bg-brand-600 active:bg-brand-700"
          >
            Pilih mapel
          </Link>
        </div>
      )}

      <BottomNav role="siswa" />
    </div>
  );
}
