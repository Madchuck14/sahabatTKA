"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Image as ImageIcon, ArrowRight } from "lucide-react";
import { ChatBubble, type Pesan } from "./ChatBubble";
import { RatingSheet } from "./RatingSheet";

type Room = {
  id: string;
  guru: { nama: string; mapel: string; online: boolean };
};

export function ChatRoom({ room, pesanAwal }: { room: Room; pesanAwal: Pesan[] }) {
  const [pesan, setPesan] = useState<Pesan[]>(pesanAwal);
  const [draft, setDraft] = useState("");
  const [rating, setRating] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // TODO: ganti dengan useChatMessages(room.id) — realtime Supabase
  const kirim = () => {
    const teks = draft.trim();
    if (!teks) return;
    setPesan((p) => [
      ...p,
      {
        id: crypto.randomUUID(),
        milikSaya: true,
        teks,
        waktu: new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "Mengirim…",
      },
    ]);
    setDraft("");
  };

  return (
    <div className="relative flex h-dvh flex-col bg-ground font-body text-ink">
      <header className="flex shrink-0 items-center gap-3 border-b-2 border-ink bg-white px-4 pb-3 pt-14">
        <Link
          href="/siswa/chat"
          aria-label="Kembali ke daftar chat"
          className="-ml-3 flex size-11 shrink-0 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <ChevronLeft size={22} strokeWidth={2.6} />
        </Link>
        <div className="size-[38px] shrink-0 bg-neutral-300 grayscale" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-heading text-[14.5px] font-bold leading-tight">
            {room.guru.nama}
          </p>
          <div className="mt-1 flex items-center gap-1.5">
            {room.guru.online && <span className="size-[7px] shrink-0 bg-brand" />}
            <span className="text-[11px] font-semibold text-ink/60">
              {room.guru.online ? "Online" : "Offline"} · {room.guru.mapel}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setRating(true)}
          className="min-h-11 shrink-0 border-2 border-ink px-2.5 font-heading text-[10px] font-extrabold uppercase tracking-[0.08em] transition-colors hover:bg-brand-100 active:bg-brand-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          Nilai
        </button>
      </header>

      <div className="flex flex-1 flex-col gap-3.5 overflow-y-auto px-4 pb-2 pt-4">
        <div className="flex items-center gap-2.5">
          <span className="h-px flex-1 bg-ink/40" />
          <span className="font-heading text-[9.5px] font-extrabold uppercase tracking-[0.12em] text-ink/50">
            Hari ini
          </span>
          <span className="h-px flex-1 bg-ink/40" />
        </div>

        {pesan.map((p) => (
          <ChatBubble key={p.id} pesan={p} />
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          kirim();
        }}
        className="flex shrink-0 items-center gap-2.5 border-t-2 border-ink bg-white px-3 pb-[calc(env(safe-area-inset-bottom)+10px)] pt-2.5"
      >
        <input ref={fileRef} type="file" accept="image/*" className="hidden" />
        <button
          type="button"
          aria-label="Kirim gambar"
          onClick={() => fileRef.current?.click()}
          className="flex size-11 shrink-0 items-center justify-center border-2 border-ink transition-colors hover:bg-brand-100 active:bg-brand-200"
        >
          <ImageIcon size={19} strokeWidth={2.2} />
        </button>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Tulis pesan…"
          aria-label="Tulis pesan"
          className="h-11 flex-1 border-2 border-ink bg-white px-3 text-[14px] placeholder:text-ink/50 focus:outline-none"
        />
        <button
          type="submit"
          aria-label="Kirim"
          className="flex size-11 shrink-0 items-center justify-center bg-brand text-white transition-colors hover:bg-brand-600 active:bg-brand-700"
        >
          <ArrowRight size={19} strokeWidth={2.4} />
        </button>
      </form>

      {rating && (
        <RatingSheet
          guruNama={room.guru.nama.split(" ").slice(0, 2).join(" ")}
          onClose={() => setRating(false)}
          onSubmit={(nilai, komentar) => {
            // TODO: insert ke tabel reviews (guru_id, siswa_id, rating, komentar)
            console.log({ nilai, komentar });
            setRating(false);
          }}
        />
      )}
    </div>
  );
}
