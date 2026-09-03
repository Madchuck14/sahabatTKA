import { notFound, redirect } from "next/navigation";
import { ChatRoom } from "@/components/ChatRoom";
import type { Pesan } from "@/components/ChatBubble";
import { createClient } from "@/lib/supabase/server";

export default async function SiswaChatRoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: room } = await supabase
    .from("chat_rooms")
    .select("id, profiles_guru(nama, jenjang, avatar_url), subjects(nama)")
    .eq("id", roomId)
    .eq("siswa_id", user.id)
    .maybeSingle();

  if (!room) notFound();

  const guru = room.profiles_guru as unknown as {
    nama: string;
    jenjang: string;
    avatar_url: string | null;
  } | null;
  const mapel = room.subjects as unknown as { nama: string } | null;

  const { data: messageRows } = await supabase
    .from("messages")
    .select("id, sender_id, content, image_url, created_at")
    .eq("room_id", roomId)
    .order("created_at", { ascending: true });

  // TODO: status online sebenarnya butuh presence realtime — untuk sekarang dianggap selalu bisa dihubungi
  const pesanAwal: Pesan[] = (messageRows ?? []).map((m) => {
    const waktu = new Date(m.created_at).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const milikSaya = m.sender_id === user.id;
    return m.image_url
      ? { id: m.id, milikSaya, imageUrl: m.image_url, waktu }
      : { id: m.id, milikSaya, teks: m.content ?? "", waktu };
  });

  return (
    <ChatRoom
      room={{
        id: roomId,
        guru: {
          nama: guru?.nama ?? "Guru",
          mapel: mapel?.nama ?? "-",
          online: true,
          avatarUrl: guru?.avatar_url ?? null,
        },
      }}
      pesanAwal={pesanAwal}
      siswaId={user.id}
    />
  );
}
