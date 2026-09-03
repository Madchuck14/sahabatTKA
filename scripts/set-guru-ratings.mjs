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

function randomRating() {
  const r = 4.2 + Math.random() * (5.0 - 4.2);
  return Math.round(r * 10) / 10;
}

async function main() {
  const { data: gurus, error } = await supabase
    .from("profiles_guru")
    .select("id, nama");
  if (error) throw error;

  for (const g of gurus) {
    const rating = randomRating();
    const { error: updErr } = await supabase
      .from("profiles_guru")
      .update({ rating_avg: rating })
      .eq("id", g.id);
    if (updErr) console.error(`gagal update ${g.nama}:`, updErr.message);
    else console.log(`OK: ${g.nama} -> ${rating}`);
  }
}

main();
