import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split("\n")
    .filter((l) => l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

const SUBJECT_IDS = {
  Fisika: "d215f2f3-2bb2-475f-b968-096353caf075",
  Biologi: "3d08df8b-0715-46fd-98e7-aa73cdf34989",
  Kimia: "1caa1d0f-22ce-4533-8bcc-3815e8171814",
  "Matematika Tingkat Lanjut": "145e3edb-78c1-4c33-9fe3-170359c0e7db",
  "Matematika Wajib": "0d8f3bbd-b486-4a2b-8dd0-a0aac4127de7",
  "Bahasa Indonesia": null, // dibuat kalau belum ada (SMA)
};

async function ensureBahasaIndonesiaSMA() {
  const { data: existing } = await supabase
    .from("subjects")
    .select("id")
    .eq("nama", "Bahasa Indonesia")
    .eq("jenjang", "SMA")
    .maybeSingle();
  if (existing) return existing.id;

  const { data: created, error } = await supabase
    .from("subjects")
    .insert({ nama: "Bahasa Indonesia", jenjang: "SMA" })
    .select("id")
    .single();
  if (error) throw error;
  return created.id;
}

// Reassign 4 guru lama (dulu link ke subject "Matematika" generik SMA) ke mapel yang benar.
const REASSIGN = [
  { email: "iman.santoso@sahabattka.id", subject: "Matematika Wajib" },
  { email: "muh.ikhwan@sahabattka.id", subject: "Matematika Tingkat Lanjut" },
];

const slug = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z. ]/g, "")
    .replace(/\s+/g, ".");

const GELAR_POOL = ["S.Pd.", "S.Pd., M.Pd.", "S.Si.", "S.Si., M.Si.", "M.Pd."];
const ALAMAT_POOL = [
  "Jl. Merdeka No. 12, Bandung",
  "Jl. Sudirman No. 45, Jakarta",
  "Jl. Diponegoro No. 8, Surabaya",
  "Jl. Ahmad Yani No. 21, Yogyakarta",
  "Jl. Gajah Mada No. 5, Semarang",
  "Jl. Veteran No. 17, Malang",
  "Jl. Pahlawan No. 30, Solo",
  "Jl. Kartini No. 9, Medan",
  "Jl. Cendrawasih No. 3, Makassar",
  "Jl. Melati No. 14, Denpasar",
];

const NEW_GURU = {
  Fisika: [
    "Bambang Wijaya",
    "Rina Kusumawati",
    "Agus Setiawan",
    "Dewi Lestari",
  ],
  Biologi: ["Hendra Gunawan", "Sri Wahyuni", "Fajar Nugroho", "Yuliana Sari"],
  Kimia: [
    "Andi Prasetyo",
    "Maya Anggraini",
    "Wahyu Ramadhan",
    "Lina Marlina",
    "Rudi Hartono",
  ],
  "Matematika Tingkat Lanjut": [
    "Eko Purnomo",
    "Nadia Safitri",
    "Taufik Hidayat",
    "Ratna Dewi",
  ],
  "Matematika Wajib": [
    "Joko Susanto",
    "Indah Permatasari",
    "Slamet Riyadi",
    "Wulan Handayani",
  ],
  "Bahasa Indonesia": [
    "Suryadi",
    "Fitriani",
    "Bagus Kurniawan",
    "Retno Wulandari",
    "Hasan Basri",
  ],
};

let addrIdx = 0;
function nextAddr() {
  return ALAMAT_POOL[addrIdx++ % ALAMAT_POOL.length];
}

async function reassignExisting() {
  for (const r of REASSIGN) {
    const { data: created } = await supabase.auth.admin.listUsers();
    const user = created.users.find((u) => u.email === r.email);
    if (!user) {
      console.error(`user tidak ditemukan: ${r.email}`);
      continue;
    }
    const subjectId = SUBJECT_IDS[r.subject];
    await supabase.from("guru_subjects").delete().eq("guru_id", user.id);
    const { error } = await supabase
      .from("guru_subjects")
      .insert({ guru_id: user.id, subject_id: subjectId });
    if (error) console.error(`gagal reassign ${r.email}:`, error.message);
    else console.log(`reassigned: ${r.email} -> ${r.subject}`);
  }
}

async function createGuru(nama, subject, subjectId) {
  const email = `${slug(nama)}@sahabattka.id`;
  const { data: createdUser, error: createErr } =
    await supabase.auth.admin.createUser({
      email,
      password: "SahabatTKA2026!",
      email_confirm: true,
      user_metadata: { role: "guru", nama },
    });
  if (createErr) {
    console.error(`gagal buat user ${nama}:`, createErr.message);
    return;
  }
  const userId = createdUser.user.id;

  const gelar = GELAR_POOL[Math.floor(Math.random() * GELAR_POOL.length)];
  const umur = 28 + Math.floor(Math.random() * 25);

  const { error: profileErr } = await supabase.from("profiles_guru").insert({
    id: userId,
    nama,
    gelar,
    umur,
    alamat: nextAddr(),
    jenjang: "SMA",
  });
  if (profileErr) {
    console.error(`gagal insert profil ${nama}:`, profileErr.message);
    return;
  }

  const { error: linkErr } = await supabase
    .from("guru_subjects")
    .insert({ guru_id: userId, subject_id: subjectId });
  if (linkErr) {
    console.error(`gagal link subject ${nama}:`, linkErr.message);
    return;
  }

  console.log(`OK: ${nama} (${email}) -> ${subject}`);
}

async function main() {
  SUBJECT_IDS["Bahasa Indonesia"] = await ensureBahasaIndonesiaSMA();

  await reassignExisting();

  for (const [subject, names] of Object.entries(NEW_GURU)) {
    for (const nama of names) {
      await createGuru(nama, subject, SUBJECT_IDS[subject]);
    }
  }
}

main();
