import { ChatRoom } from "@/components/ChatRoom";
import type { Pesan } from "@/components/ChatBubble";

// TODO: ganti dengan query chat_rooms + profiles_guru by roomId
const ROOM = {
  guru: { nama: "Bu Sinta Wulandari, M.Pd", mapel: "Matematika", online: true },
};

// TODO: ganti dengan Supabase Realtime — messages where room_id = params.roomId
const PESAN_AWAL: Pesan[] = [
  { id: "1", milikSaya: false, teks: "Halo Rara, ada yang mau ditanyain soal limit?", waktu: "09.12" },
  {
    id: "2",
    milikSaya: true,
    teks: "Iya bu, aku bingung nomor 4 yang bentuk akar",
    waktu: "09.14",
    status: "Terkirim",
  },
  { id: "3", milikSaya: true, imageUrl: null, waktu: "09.14", status: "Foto soal" },
  {
    id: "4",
    milikSaya: false,
    teks:
      "Oke, kalikan pembilang dan penyebut sama akar sekawannya dulu ya. Coba tulis langkah pertamanya, nanti aku cek.",
    waktu: "09.19",
  },
];

export default async function SiswaChatRoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;

  return <ChatRoom room={{ id: roomId, guru: ROOM.guru }} pesanAwal={PESAN_AWAL} />;
}
