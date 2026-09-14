"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";

type Role = "siswa" | "guru";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("siswa");
  const [showPw, setShowPw] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginInput) {
    const supabase = createClient();
    const { data: signIn, error } = await supabase.auth.signInWithPassword(data);
    if (error || !signIn.user) {
      toast.error(error?.message ?? "Email atau kata sandi salah");
      return;
    }

    // Jangan percaya switch mentah-mentah — cek role sebenarnya dari tabel profil.
    const { data: siswaProfile } = await supabase
      .from("profiles_siswa")
      .select("id")
      .eq("id", signIn.user.id)
      .maybeSingle();

    if (siswaProfile) {
      router.push("/siswa/home");
      return;
    }

    const { data: guruProfile } = await supabase
      .from("profiles_guru")
      .select("id")
      .eq("id", signIn.user.id)
      .maybeSingle();

    if (guruProfile) {
      router.push("/guru/chat");
      return;
    }

    toast.error("Profil tidak ditemukan untuk akun ini");
  }

  return (
    <div className="min-h-dvh bg-ground font-body text-ink">
      <header className="relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-brand-600 via-brand to-brand-300 px-5 pb-10 pt-16 text-white">
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full opacity-40"
          viewBox="0 0 400 260"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0,90 C110,150 290,10 400,70 L400,0 L0,0 Z" fill="#003BA3" fillOpacity="0.5" />
          <path d="M0,260 C130,180 270,260 400,190 L400,260 Z" fill="#0051D4" fillOpacity="0.5" />
        </svg>
        <Image
          src="/logo-sahabattka.png"
          alt="sahabatTKA"
          width={210}
          height={210}
          className="relative rounded"
        />
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white px-5 pb-2 pt-6">
        <label className="block text-center font-heading text-[15px] font-extrabold uppercase tracking-[0.1em] text-ink/60">
          Masuk sebagai
        </label>
        <div className="mt-2 grid grid-cols-2 gap-2" role="radiogroup">
          {(["siswa", "guru"] as Role[]).map((r) => (
            <button
              key={r}
              type="button"
              role="radio"
              aria-checked={role === r}
              onClick={() => setRole(r)}
              className={`min-h-11 rounded-2xl py-2.5 text-center font-heading text-[12.5px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                role === r
                  ? "bg-brand font-extrabold text-white"
                  : "bg-neutral-100 font-bold text-ink hover:bg-brand-100"
              }`}
            >
              {r === "siswa" ? "Siswa" : "Guru"}
            </button>
          ))}
        </div>

        <label
          htmlFor="email"
          className="mt-5 block font-heading text-[10px] font-extrabold uppercase tracking-[0.1em] text-ink/60"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="nama@email.com"
          className="mt-2 w-full rounded-2xl bg-neutral-100 px-3 py-3 text-[14px] placeholder:text-neutral-500 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          {...register("email")}
        />
        {errors.email && (
          <p className="mt-1 text-[11.5px] text-brand-700">{errors.email.message}</p>
        )}

        <label
          htmlFor="password"
          className="mt-4 block font-heading text-[10px] font-extrabold uppercase tracking-[0.1em] text-ink/60"
        >
          Kata sandi
        </label>
        <div className="mt-2 flex items-center rounded-2xl bg-neutral-100 px-3 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand">
          <input
            id="password"
            type={showPw ? "text" : "password"}
            placeholder="••••••••"
            className="min-h-11 flex-1 bg-transparent py-3 text-[14px] placeholder:text-neutral-500 focus:outline-none"
            {...register("password")}
          />
          <button
            type="button"
            aria-label={showPw ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
            onClick={() => setShowPw((v) => !v)}
            className="shrink-0 text-ink/50"
          >
            {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-[11.5px] text-brand-700">{errors.password.message}</p>
        )}

        <div className="mt-3 flex justify-end">
          <Link href="/lupa-sandi" className="text-[12px] font-semibold text-brand-700">
            Lupa kata sandi?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-5 w-full rounded-2xl bg-brand px-4 py-3.5 text-center font-heading text-[14px] font-extrabold text-white transition-colors hover:bg-brand-600 active:bg-brand-700 disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          {isSubmitting ? "Memeriksa…" : "Masuk"}
        </button>

        <p className="mb-7 mt-6 text-center text-[13px] leading-snug text-ink/60">
          Belum punya akun?{" "}
          <Link href="/register" className="font-bold text-brand-700">
            Buat akun sendiri
          </Link>
        </p>
      </form>
    </div>
  );
}
