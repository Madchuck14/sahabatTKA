import { PilihGuru } from "@/components/PilihGuru";
import { createClient } from "@/lib/supabase/server";
import { DUMMY_GURU_NAMA } from "@/lib/dummyChat";

export default async function PilihGuruPage({
  params,
}: {
  params: Promise<{ subjectId: string }>;
}) {
  const { subjectId } = await params;
  const supabase = await createClient();

  const { data: subject } = await supabase
    .from("subjects")
    .select("nama")
    .eq("id", subjectId)
    .maybeSingle();

  const { data: guruRows } = await supabase
    .from("profiles_guru")
    .select(
      "id, nama, jenjang, rating_avg, avatar_url, created_at, reviews(count), guru_subjects!inner(subject_id)",
    )
    .eq("guru_subjects.subject_id", subjectId)
    .order("rating_avg", { ascending: false });

  // TODO: ganti dengan status presence realtime — untuk sekarang semua guru terdaftar dianggap bisa dihubungi
  const guru = (guruRows ?? []).map((g) => ({
    id: g.id,
    nama: g.nama,
    tahunMengajar: Math.max(
      1,
      new Date().getFullYear() - new Date(g.created_at).getFullYear(),
    ),
    jenjang: g.jenjang,
    rating: (g.rating_avg ?? 0).toFixed(1).replace(".", ","),
    reviews: g.reviews?.[0]?.count ?? 0,
    online: true,
    avatarUrl: g.avatar_url as string | null,
  }));

  // Pin subjek demo chat dummy supaya selalu tampil paling atas
  guru.sort((a, b) => Number(b.nama === DUMMY_GURU_NAMA) - Number(a.nama === DUMMY_GURU_NAMA));

  return <PilihGuru subjectId={subjectId} namaMapel={subject?.nama ?? "Mapel"} guru={guru} />;
}
