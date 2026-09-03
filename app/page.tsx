import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Jangan percaya switch mentah-mentah — cek role sebenarnya dari tabel profil.
  const { data: siswaProfile } = await supabase
    .from("profiles_siswa")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (siswaProfile) redirect("/siswa/home");

  const { data: guruProfile } = await supabase
    .from("profiles_guru")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (guruProfile) redirect("/guru/chat");

  redirect("/login");
}
