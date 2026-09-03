"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import {
  jenjangEnum,
  registerSiswaSchema,
  type RegisterSiswaInput,
} from "@/lib/validations/auth";
import type { z } from "zod";

const JENJANG_OPTIONS = jenjangEnum.options;

type RegisterSiswaFormInput = z.input<typeof registerSiswaSchema>;

export default function RegisterSiswaPage() {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSiswaFormInput, unknown, RegisterSiswaInput>({
    resolver: zodResolver(registerSiswaSchema),
    defaultValues: { jenjang: "SMA" },
  });

  const onSubmit: SubmitHandler<RegisterSiswaInput> = async (data) => {
    const supabase = createClient();
    const { data: signUp, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });
    if (error || !signUp.user) {
      toast.error(error?.message ?? "Gagal membuat akun");
      return;
    }

    const { error: profileError } = await supabase.from("profiles_siswa").insert({
      id: signUp.user.id,
      nama: data.nama,
      nis: data.nis,
      umur: data.umur,
      alamat: data.alamat,
      jenjang: data.jenjang,
    });
    if (profileError) {
      toast.error(profileError.message);
      return;
    }

    toast.success("Akun berhasil dibuat");
    router.push("/siswa/home");
  }

  return (
    <div className="min-h-dvh bg-ground font-body text-ink">
      <header className="bg-brand px-5 pb-[22px] pt-16 text-white">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-heading text-[12px] font-extrabold uppercase tracking-[0.18em]">
            <Image src="/logo-sahabattka.png" alt="sahabatTKA" width={20} height={20} className="rounded" />
            sahabatTKA
          </span>
          <span className="text-[11px] font-semibold opacity-90">Daftar sebagai Siswa</span>
        </div>
        <h1 className="mt-[18px] font-heading text-[28px] font-black leading-[1.05] -tracking-[0.02em]">
          BUAT AKUN
          <br />
          SISWA
        </h1>
        <div className="mt-[18px] h-0.5 bg-white/50" />
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white px-5 pb-2 pt-[22px]">
        <p className="font-heading text-[10.5px] font-extrabold uppercase tracking-[0.12em] text-brand">
          Data diri
        </p>

        <Field label="Nama lengkap" htmlFor="nama" error={errors.nama?.message}>
          <input
            id="nama"
            placeholder="Nama sesuai identitas"
            className="input"
            {...register("nama")}
          />
        </Field>

        <Field label="NIS" htmlFor="nis" error={errors.nis?.message}>
          <input
            id="nis"
            placeholder="Nomor Induk Siswa"
            className="input"
            {...register("nis")}
          />
        </Field>

        <Field label="Umur" htmlFor="umur" error={errors.umur?.message}>
          <input
            id="umur"
            type="number"
            min={5}
            max={25}
            placeholder="Tahun"
            className="input"
            {...register("umur")}
          />
        </Field>

        <Field label="Alamat" htmlFor="alamat" error={errors.alamat?.message}>
          <input
            id="alamat"
            placeholder="Kota/kabupaten domisili"
            className="input"
            {...register("alamat")}
          />
        </Field>

        <label className="mt-4 block font-heading text-[10px] font-extrabold uppercase tracking-[0.1em] text-ink/60">
          Jenjang
        </label>
        <Controller
          control={control}
          name="jenjang"
          render={({ field }) => (
            <div className="mt-2 grid grid-cols-4 border-2 border-ink" role="radiogroup">
              {JENJANG_OPTIONS.map((j, i) => (
                <button
                  key={j}
                  type="button"
                  role="radio"
                  aria-checked={field.value === j}
                  onClick={() => field.onChange(j)}
                  className={`min-h-11 px-1 py-2.5 text-center text-[12.5px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand ${
                    i > 0 ? "border-l-2 border-ink" : ""
                  } ${
                    field.value === j
                      ? "bg-brand font-heading font-extrabold text-white"
                      : "bg-white font-bold text-ink hover:bg-brand-100"
                  }`}
                >
                  {j}
                </button>
              ))}
            </div>
          )}
        />

        <div className="mt-6 h-0.5 bg-ink" />
        <p className="mt-[18px] font-heading text-[10.5px] font-extrabold uppercase tracking-[0.12em] text-brand">
          Akun masuk
        </p>

        <Field label="Email" htmlFor="email" error={errors.email?.message}>
          <input
            id="email"
            type="email"
            placeholder="nama@email.com"
            className="input"
            {...register("email")}
          />
        </Field>

        <label
          htmlFor="password"
          className="mt-4 block font-heading text-[10px] font-extrabold uppercase tracking-[0.1em] text-ink/60"
        >
          Kata sandi
        </label>
        <div className="mt-2 flex items-center border-2 border-ink bg-white px-3 focus-within:outline focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-brand">
          <input
            id="password"
            type={showPw ? "text" : "password"}
            placeholder="Minimal 8 karakter"
            className="min-h-11 flex-1 bg-transparent py-3 text-[14px] placeholder:text-ink/45 focus:outline-none"
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-full bg-brand px-4 py-3.5 text-left font-heading text-[14px] font-extrabold text-white transition-colors hover:bg-brand-600 active:bg-brand-700 disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          {isSubmitting ? "Membuat akun…" : "Buat akun"}
        </button>

        <p className="mb-7 mt-[22px] text-center text-[13px] leading-snug text-ink/60">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-bold text-brand-700">
            Masuk di sini
          </Link>
        </p>
      </form>

      <style jsx global>{`
        .input {
          margin-top: 8px;
          width: 100%;
          min-height: 44px;
          border: 2px solid var(--color-ink);
          background: white;
          padding: 12px 13px;
          font-size: 14px;
        }
        .input::placeholder {
          color: rgb(32 30 29 / 0.45);
        }
        .input:focus-visible {
          outline: 2px solid var(--color-brand);
          outline-offset: -2px;
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-4">
      <label
        htmlFor={htmlFor}
        className="block font-heading text-[10px] font-extrabold uppercase tracking-[0.1em] text-ink/60"
      >
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-[11.5px] text-brand-700">{error}</p>}
    </div>
  );
}
