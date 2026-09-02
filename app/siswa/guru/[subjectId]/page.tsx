import { PilihGuru } from "@/components/PilihGuru";

// TODO: ganti dengan query subjects by id
const SUBJECT_MAP: Record<string, string> = {
  "1": "Fisika",
  "2": "Biologi",
  "3": "Kimia",
  "4": "Matematika Tingkat Lanjut",
  "5": "Matematika Wajib",
  "6": "Bahasa Indonesia",
};

// TODO: ganti dengan query profiles_guru join guru_subjects where subject_id, rating_avg, review count, presence
const GURU = [
  {
    id: "g1",
    nama: "Bu Sinta Wulandari, M.Pd",
    tahunMengajar: 6,
    jenjang: "SMA",
    rating: "4,9",
    reviews: 128,
    online: true,
  },
  {
    id: "g2",
    nama: "Pak Bima Nugraha, S.Pd",
    tahunMengajar: 4,
    jenjang: "SMA",
    rating: "4,8",
    reviews: 94,
    online: true,
  },
  {
    id: "g3",
    nama: "Bu Nadia Kusuma, M.Pd",
    tahunMengajar: 9,
    jenjang: "SMA",
    rating: "5,0",
    reviews: 201,
    online: false,
  },
  {
    id: "g4",
    nama: "Pak Dwi Handoko, M.Pd",
    tahunMengajar: 8,
    jenjang: "SMA",
    rating: "4,7",
    reviews: 76,
    online: true,
  },
];

export default async function PilihGuruPage({
  params,
}: {
  params: Promise<{ subjectId: string }>;
}) {
  const { subjectId } = await params;
  const namaMapel = SUBJECT_MAP[subjectId] ?? "Mapel";

  return <PilihGuru subjectId={subjectId} namaMapel={namaMapel} guru={GURU} />;
}
