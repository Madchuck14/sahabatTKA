import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AvatarUpload } from "@/components/AvatarUpload";
import { BottomNav } from "@/components/BottomNav";

export default async function SiswaAkunPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles_siswa")
    .select("nama, avatar_url")
    .eq("id", user.id)
    .single();

  return (
    <div className="flex min-h-dvh flex-col">
      <main className="flex-1 p-6">
        <h1 className="mb-6 text-xl font-semibold">Akun Siswa</h1>
        <AvatarUpload
          userId={user.id}
          role="siswa"
          nama={profile?.nama ?? "Siswa"}
          currentUrl={profile?.avatar_url ?? null}
        />
      </main>
      <BottomNav role="siswa" />
    </div>
  );
}
