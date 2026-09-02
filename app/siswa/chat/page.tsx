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
      {/* HEADER merah — lanjutan bahasa hero home */}
      <header className="shrink-0 bg-brand px-5 pb-4 pt-14 text-white">
        <div className="flex items-center justify-between">
          <span className="font-heading text-[12px] font-extrabold uppercase tracking-[0.18em]">
            HaloGuru
          </span>
          <span className="text-[11px] font-semibold opacity-90">Rara · Kelas 11</span>
        </div>
        <h1 className="mt-5 font-heading text-[30px] font-black leading-[0.98] -tracking-[0.03em]">
          CHAT KAMU
        </h1>
        <div className="mb-3 mt-4 h-0.5 bg-white/50" />
        <p className="text-[12.5px] leading-snug text-white/90">
          {ROOMS.length} konsultasi aktif · {unreadTotal} pesan belum dibaca
        </p>
      </header>

      {ROOMS.length > 0 ? (
        <ul className="flex-1 overflow-y-auto">
          {ROOMS.map((r, i) => (
            <li
              key={r.id}
              className={
                i === ROOMS.length - 1 ? "border-b-2 border-ink" : "border-b border-ink/40"
              }
            >
              <Link
                href={`/siswa/chat/${r.id}`}
                className="flex items-start gap-3 px-5 py-4 transition-colors hover:bg-brand-100 active:bg-brand-200 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand"
              >
                <div className="size-[46px] shrink-0 bg-neutral-300 grayscale" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <p className="flex-1 truncate font-heading text-[14.5px] font-bold leading-tight">
                      {r.guru}
                    </p>
                    <span className="shrink-0 text-[10.5px] font-semibold text-ink/50">
                      {r.time}
                    </span>
                  </div>
                  <p className="mt-1.5 font-heading text-[9.5px] font-extrabold uppercase tracking-[0.12em] text-brand">
                    {r.mapel}
                  </p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <p className="flex-1 truncate text-[12.5px] leading-snug text-ink/65">
                      {r.last}
                    </p>
                    {r.unread > 0 && (
                      <span className="shrink-0 bg-brand px-1.5 py-1 font-heading text-[10.5px] font-extrabold text-white">
                        {r.unread}
                        <span className="sr-only"> pesan belum dibaca</span>
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </li>
          ))}
          <li className="p-5 text-[12px] leading-relaxed text-ink/50">
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
