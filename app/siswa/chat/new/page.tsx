import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DUMMY_GURU_ID } from "@/lib/dummyChat";

export default async function NewChatRoomPage({
  searchParams,
}: {
  searchParams: Promise<{ guruId?: string; subjectId?: string }>;
}) {
  const { guruId, subjectId } = await searchParams;
  if (!guruId) redirect("/siswa/home");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: existingRoom } = await supabase
    .from("chat_rooms")
    .select("id")
    .eq("siswa_id", user.id)
    .eq("guru_id", guruId)
    .maybeSingle();

  if (existingRoom) {
    // Reset histori chat dummy tiap mulai chat baru dari Pilih Guru — lebih andal
    // daripada nunggu event "keluar room" yang bisa dilewati banyak cara (back browser, dll).
    if (guruId === DUMMY_GURU_ID) {
      await supabase.from("messages").delete().eq("room_id", existingRoom.id);
    }
    redirect(`/siswa/chat/${existingRoom.id}`);
  }

  const { data: newRoom } = await supabase
    .from("chat_rooms")
    .insert({ siswa_id: user.id, guru_id: guruId, subject_id: subjectId ?? null })
    .select("id")
    .single();

  if (!newRoom) redirect("/siswa/guru");

  redirect(`/siswa/chat/${newRoom.id}`);
}
