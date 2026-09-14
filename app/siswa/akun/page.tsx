import { redirect } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AvatarUpload } from "@/components/AvatarUpload";
import { BottomNav } from "@/components/BottomNav";
import { SignOutButton } from "@/components/SignOutButton";

function ListItem({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-ink/10 p-3.5 transition-colors last:border-b-0 hover:bg-brand-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
      <span className="font-heading text-[13px] font-bold text-ink">{label}</span>
      {value ? (
        <span className="text-[12.5px] text-ink/55">{value}</span>
      ) : (
        <ChevronRight size={16} className="text-ink/55" />
      )}
    </div>
  );
}

export default async function SiswaAkunPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles_siswa")
    .select("nama, avatar_url, jenjang")
    .eq("id", user.id)
    .single();

  const nama = profile?.nama ?? "Siswa";

  return (
    <div className="flex min-h-dvh flex-col bg-ground font-body text-ink">
      <div className="flex-1 overflow-y-auto pb-[calc(env(safe-area-inset-bottom)+82px)]">
        {/* HEADER */}
        <header className="relative flex flex-col items-center gap-2.5 overflow-hidden bg-gradient-to-br from-brand-600 via-brand to-brand-300 px-5 pb-7 pt-11 text-white">
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full opacity-40"
            viewBox="0 0 400 260"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M0,90 C110,150 290,10 400,70 L400,0 L0,0 Z" fill="#003BA3" fillOpacity="0.5" />
            <path d="M0,260 C130,180 270,260 400,190 L400,260 Z" fill="#0051D4" fillOpacity="0.5" />
          </svg>

          <div className="relative flex flex-col items-center gap-2.5">
            <AvatarUpload
              userId={user.id}
              role="siswa"
              nama={nama}
              currentUrl={profile?.avatar_url ?? null}
              variant="square"
            />
            <p className="font-heading text-[16px] font-extrabold">{nama}</p>
            <p className="text-[11px] text-white/80">{user.email}</p>
          </div>
        </header>

        {/* PROFIL */}
        <section className="p-5">
          <h2 className="pb-2.5 font-heading text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-brand">
            Profil
          </h2>
          <div className="rounded-2xl bg-white shadow-sm">
            <ListItem label="Jenjang" value={profile?.jenjang ?? "-"} />
            <ListItem label="Ganti kata sandi" />
          </div>
        </section>

        {/* LAINNYA */}
        <section className="px-5 pb-7">
          <h2 className="pb-2.5 font-heading text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-brand">
            Lainnya
          </h2>
          <div className="rounded-2xl bg-white shadow-sm">
            <ListItem label="Bantuan & FAQ" />
            <ListItem label="Tentang sahabatTKA" />
          </div>

          <div className="mt-5">
            <SignOutButton />
          </div>
        </section>
      </div>

      <BottomNav role="siswa" />
    </div>
  );
}
