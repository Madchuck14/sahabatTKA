export type Pesan = {
  id: string;
  milikSaya: boolean;
  teks?: string;
  imageUrl?: string | null;
  waktu: string;
  status?: string;
};

export function ChatBubble({ pesan }: { pesan: Pesan }) {
  const { milikSaya, teks, imageUrl, waktu, status } = pesan;

  return (
    <div className={`flex flex-col gap-1.5 ${milikSaya ? "items-end" : "items-start"}`}>
      {imageUrl !== undefined ? (
        <figure className="m-0 w-[64%] border-2 border-ink bg-white p-[3px]">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt="Lampiran chat"
              className="block h-auto w-full grayscale"
            />
          ) : (
            <div className="h-[150px] w-full bg-neutral-300 grayscale" />
          )}
        </figure>
      ) : (
        <p
          className={`m-0 max-w-[78%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-[14px] leading-relaxed ${
            milikSaya ? "bg-brand text-white" : "bg-white text-ink"
          }`}
        >
          {teks}
        </p>
      )}
      <span className="text-[10px] font-semibold text-ink/45">
        {waktu}
        {status ? ` · ${status}` : ""}
      </span>
    </div>
  );
}
