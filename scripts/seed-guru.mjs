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

const gurus = [
  {
    nama: "Iman Santoso",
    email: "iman.santoso@sahabattka.id",
    gelar: "S.Pd.",
    umur: 42,
    alamat: "Jl. Merdeka No. 12, Bandung",
    jenjang: "SMA",
    subject: "Matematika",
  },
  {
    nama: "Muh. Ikhwan",
    email: "muh.ikhwan@sahabattka.id",
    gelar: "S.Pd., M.Pd.",
    umur: 35,
    alamat: "Jl. Sudirman No. 45, Jakarta",
    jenjang: "SMA",
    subject: "Matematika",
  },
  {
    nama: "Siswanto",
    email: "siswanto@sahabattka.id",
    gelar: "S.Si.",
    umur: 39,
    alamat: "Jl. Diponegoro No. 8, Surabaya",
    jenjang: "SMA",
    subject: "Fisika",
  },
  {
    nama: "Tatit Novi Sahara",
    email: "tatit.novisahara@sahabattka.id",
    gelar: "S.Pd.",
    umur: 31,
    alamat: "Jl. Ahmad Yani No. 21, Yogyakarta",
    jenjang: "SMA",
    subject: "Biologi",
  },
];

const password = "SahabatTKA2026!";

for (const g of gurus) {
  const { data: created, error: createErr } =
    await supabase.auth.admin.createUser({
      email: g.email,
      password,
      email_confirm: true,
      user_metadata: { role: "guru", nama: g.nama },
    });

  if (createErr) {
    console.error(`gagal buat user ${g.nama}:`, createErr.message);
    continue;
  }

  const userId = created.user.id;

  const { error: profileErr } = await supabase.from("profiles_guru").insert({
    id: userId,
    nama: g.nama,
    gelar: g.gelar,
    umur: g.umur,
    alamat: g.alamat,
    jenjang: g.jenjang,
  });

  if (profileErr) {
    console.error(`gagal insert profil ${g.nama}:`, profileErr.message);
    continue;
  }

  let { data: subject } = await supabase
    .from("subjects")
    .select("id")
    .eq("nama", g.subject)
    .eq("jenjang", g.jenjang)
    .maybeSingle();

  if (!subject) {
    const { data: newSubject, error: subjErr } = await supabase
      .from("subjects")
      .insert({ nama: g.subject, jenjang: g.jenjang })
      .select("id")
      .single();
    if (subjErr) {
      console.error(`gagal buat subject ${g.subject}:`, subjErr.message);
      continue;
    }
    subject = newSubject;
  }

  const { error: linkErr } = await supabase.from("guru_subjects").insert({
    guru_id: userId,
    subject_id: subject.id,
  });

  if (linkErr) {
    console.error(`gagal link subject ${g.nama}:`, linkErr.message);
    continue;
  }

  console.log(`OK: ${g.nama} (${g.email}) -> ${g.subject}`);
}
