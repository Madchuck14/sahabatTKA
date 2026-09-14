"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, Image as ImageIcon, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { DUMMY_GURU_NAMA, DUMMY_GURU_SCRIPT } from "@/lib/dummyChat";
import { ChatBubble, type Pesan } from "./ChatBubble";
import { RatingSheet } from "./RatingSheet";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

type Room = {
  id: string;
  guru: { nama: string; mapel: string; online: boolean; avatarUrl: string | null };
};

function waktuSekarang() {
  return new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

// Susun ulang transkrip dummy: sapaan pembuka Bu Wulan, lalu setiap pesan siswa yang sudah
// tersimpan disusul balasan skrip yang sesuai — supaya histori tetap utuh setelah reload.
// Giliran pertama butuh 2 pesan siswa (gambar + teks dianggap satu giliran) sebelum dibalas,
// setelah itu tiap 1 pesan langsung dibalas.
function bangunTranskripDummy(real: Pesan[]): Pesan[] {
  const pesanSiswa = real.filter((m) => m.milikSaya);
  const hasil: Pesan[] = [
    { id: "dummy-guru-0", milikSaya: false, teks: DUMMY_GURU_SCRIPT[0], waktu: waktuSekarang() },
  ];
  pesanSiswa.forEach((m, i) => {
    hasil.push(m);
    if (i === 0) return;
    const balasan = DUMMY_GURU_SCRIPT[i];
    if (balasan) {
      hasil.push({ id: `dummy-guru-${i}`, milikSaya: false, teks: balasan, waktu: m.waktu });
    }
  });
  return hasil;
}

export function ChatRoom({
  room,
  pesanAwal,
  siswaId,
}: {
  room: Room;
  pesanAwal: Pesan[];
  siswaId: string;
}) {
  const router = useRouter();
  const isDummy = room.guru.nama === DUMMY_GURU_NAMA;
  const [pesan, setPesan] = useState<Pesan[]>(() =>
    isDummy ? bangunTranskripDummy(pesanAwal) : pesanAwal
  );
  const [draft, setDraft] = useState("");
  const [rating, setRating] = useState(false);
  const [mengetik, setMengetik] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const bawahRef = useRef<HTMLDivElement>(null);
  const jumlahPesanSiswaRef = useRef(pesanAwal.filter((m) => m.milikSaya).length);

  useEffect(() => {
    bawahRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [pesan, mengetik]);

  // Simulasikan Bu Wulan membalas sesuai skrip, dipanggil setelah kirim sukses.
  // Giliran pertama butuh 2 pesan siswa dulu sebelum dibalas; setelahnya tiap 1 pesan langsung dibalas.
  async function pancingBalasanDummy() {
    if (!isDummy) return;
    const jumlah = jumlahPesanSiswaRef.current;
    if (jumlah < 2) return;
    const balasan = DUMMY_GURU_SCRIPT[jumlah - 1];
    if (!balasan) return;

    setMengetik(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setMengetik(false);
    setPesan((p) => [
      ...p,
      { id: crypto.randomUUID(), milikSaya: false, teks: balasan, waktu: waktuSekarang() },
    ]);
  }

  // Reset histori chat dummy setiap keluar room, supaya demo bisa diulang dari sapaan awal
  const keluarRoom = () => {
    if (isDummy) {
      const supabase = createClient();
      supabase
        .from("messages")
        .delete()
        .eq("room_id", room.id)
        .then(({ error }) => {
          if (error) toast.error("Gagal reset chat dummy: " + error.message);
        });
    }
    router.push("/siswa/chat");
  };

  // TODO: dengarkan Supabase Realtime di room.id supaya balasan guru sungguhan muncul tanpa reload
  const kirim = async () => {
    const teks = draft.trim();
    if (!teks) return;
    setDraft("");

    const id = crypto.randomUUID();
    const waktu = waktuSekarang();

    setPesan((p) => [...p, { id, milikSaya: true, teks, waktu, status: "Mengirim…" }]);

    const supabase = createClient();
    const { error } = await supabase
      .from("messages")
      .insert({ id, room_id: room.id, sender_id: siswaId, content: teks });

    setPesan((p) =>
      p.map((m) => (m.id === id ? { ...m, status: error ? "Gagal terkirim" : "Terkirim" } : m))
    );
    if (error) {
      toast.error(error.message || "Gagal mengirim pesan");
    } else {
      jumlahPesanSiswaRef.current += 1;
      pancingBalasanDummy();
    }
  };

  const kirimGambar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Format gambar harus JPG, PNG, atau WEBP");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      toast.error("Ukuran gambar maksimal 5MB");
      return;
    }

    const id = crypto.randomUUID();
    const waktu = waktuSekarang();
    const previewUrl = URL.createObjectURL(file);

    setPesan((p) => [
      ...p,
      { id, milikSaya: true, imageUrl: previewUrl, waktu, status: "Mengunggah…" },
    ]);

    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop();
      const path = `${siswaId}/${room.id}/${id}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("chat-images")
        .upload(path, file);
      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("chat-images").getPublicUrl(path);

      const { error: insertError } = await supabase
        .from("messages")
        .insert({ id, room_id: room.id, sender_id: siswaId, image_url: publicUrl });
      if (insertError) throw insertError;

      setPesan((p) =>
        p.map((m) => (m.id === id ? { ...m, imageUrl: publicUrl, status: "Terkirim" } : m))
      );
      URL.revokeObjectURL(previewUrl);
      jumlahPesanSiswaRef.current += 1;
      pancingBalasanDummy();
    } catch (err) {
      setPesan((p) => (p.map((m) => (m.id === id ? { ...m, status: "Gagal terkirim" } : m))));
      toast.error(err instanceof Error ? err.message : "Gagal upload gambar");
    }
  };

  return (
    <div className="relative flex h-dvh flex-col bg-ground font-body text-ink">
      <header className="flex shrink-0 items-center gap-3 border-b-2 border-ink bg-white px-4 pb-3 pt-14">
        <Link
          href="/siswa/chat"
          aria-label="Kembali ke daftar chat"
          onClick={(e) => {
            e.preventDefault();
            keluarRoom();
          }}
          className="-ml-3 flex size-11 shrink-0 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          <ChevronLeft size={22} strokeWidth={2.6} />
        </Link>
        <div className="relative size-[38px] shrink-0 overflow-hidden bg-neutral-300">
          {room.guru.avatarUrl && (
            <Image
              src={room.guru.avatarUrl}
              alt={room.guru.nama}
              fill
              unoptimized
              className="object-cover"
            />
          )}
        </div>
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

        {mengetik && (
          <div className="flex flex-col items-start gap-1.5">
            <div className="m-0 flex w-fit items-center gap-1 border-2 border-ink bg-white px-3.5 py-3.5">
              <span className="size-[6px] animate-bounce rounded-full bg-ink/50 [animation-delay:-0.3s]" />
              <span className="size-[6px] animate-bounce rounded-full bg-ink/50 [animation-delay:-0.15s]" />
              <span className="size-[6px] animate-bounce rounded-full bg-ink/50" />
            </div>
          </div>
        )}

        <div ref={bawahRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          kirim();
        }}
        className="flex shrink-0 items-center gap-2.5 border-t-2 border-ink bg-white px-3 pb-[calc(env(safe-area-inset-bottom)+10px)] pt-2.5"
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={kirimGambar}
        />
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
          className="h-11 flex-1 rounded-2xl border-2 border-ink bg-white px-3 text-[14px] placeholder:text-ink/50 focus:outline-none"
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
