"use client";

import { useState } from "react";

export function RatingSheet({
  guruNama,
  onClose,
  onSubmit,
}: {
  guruNama: string;
  onClose: () => void;
  onSubmit: (rating: number, komentar: string) => void;
}) {
  const [rating, setRating] = useState(0);
  const [komentar, setKomentar] = useState("");

  const LABELS = ["", "Kurang", "Cukup", "Oke", "Membantu banget", "Luar biasa"];

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <button
        type="button"
        aria-label="Tutup"
        onClick={onClose}
        className="absolute inset-0 bg-ink/45"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Beri rating untuk ${guruNama}`}
        className="relative border-t-2 border-ink bg-white px-5 pb-[calc(env(safe-area-inset-bottom)+26px)] pt-6"
      >
        <p className="font-heading text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-brand">
          Kasih rating
        </p>
        <h2 className="mt-2.5 font-heading text-[22px] font-extrabold leading-tight -tracking-[0.02em]">
          Gimana konsultasi
          <br />
          sama {guruNama}?
        </h2>

        <div className="my-4 h-0.5 bg-ink" />

        <div className="flex gap-2" role="radiogroup" aria-label="Rating 1 sampai 5">
          {[1, 2, 3, 4, 5].map((n) => {
            const on = n <= rating;
            return (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={on}
                aria-label={`${n} bintang`}
                onClick={() => setRating(n)}
                className={`flex size-[46px] items-center justify-center font-heading text-[18px] font-extrabold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                  on ? "bg-brand text-white" : "border-2 border-ink text-ink/35 hover:bg-brand-100"
                }`}
              >
                ★
              </button>
            );
          })}
        </div>
        <p className="mt-2.5 text-[11.5px] font-semibold text-ink/60">
          {rating ? `${rating} dari 5 — ${LABELS[rating]}` : "Pilih jumlah bintang"}
        </p>

        <textarea
          value={komentar}
          onChange={(e) => setKomentar(e.target.value)}
          rows={2}
          placeholder="Tulis komentar (opsional)…"
          aria-label="Komentar"
          className="mt-4 w-full resize-none border-2 border-ink bg-white p-3 text-[13.5px] leading-snug placeholder:text-ink/50 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand"
        />

        <div className="mt-4 flex gap-2.5">
          <button
            type="button"
            disabled={!rating}
            onClick={() => onSubmit(rating, komentar)}
            className="min-h-11 flex-1 bg-brand px-4 font-heading text-[13.5px] font-extrabold text-white transition-colors hover:bg-brand-600 active:bg-brand-700 disabled:bg-neutral-300 disabled:text-ink/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            Kirim rating
          </button>
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 border-2 border-ink px-4 font-heading text-[13.5px] font-extrabold transition-colors hover:bg-brand-100 active:bg-brand-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            Nanti
          </button>
        </div>
      </div>
    </div>
  );
}
