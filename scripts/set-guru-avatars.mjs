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

async function main() {
  const { data: gurus, error } = await supabase
    .from("profiles_guru")
    .select("id, nama");
  if (error) throw error;

  for (const g of gurus) {
    const svgUrl = `https://api.dicebear.com/9.x/miniavs/svg?seed=${encodeURIComponent(
      g.nama
    )}&radius=0&backgroundType=solid`;
    const res = await fetch(svgUrl);
    if (!res.ok) {
      console.error(`gagal unduh avatar ${g.nama}: ${res.status}`);
      continue;
    }
    const svg = await res.text();
    const path = `${g.id}/avatar.svg`;

    const { error: upErr } = await supabase.storage
      .from("avatars")
      .upload(path, svg, { contentType: "image/svg+xml", upsert: true });
    if (upErr) {
      console.error(`gagal upload ${g.nama}:`, upErr.message);
      continue;
    }

    const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
    const { error: updErr } = await supabase
      .from("profiles_guru")
      .update({ avatar_url: pub.publicUrl })
      .eq("id", g.id);
    if (updErr) console.error(`gagal update url ${g.nama}:`, updErr.message);
    else console.log(`OK: ${g.nama} -> ${pub.publicUrl}`);
  }
}

main();
