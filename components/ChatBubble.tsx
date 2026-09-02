import Image from "next/image";
import { cn } from "@/lib/utils";

export function ChatBubble({
  content,
  imageUrl,
  isOwn,
}: {
  content?: string | null;
  imageUrl?: string | null;
  isOwn: boolean;
}) {
  return (
    <div className={cn("flex", isOwn ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-2 text-sm",
          isOwn
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground"
        )}
      >
        {imageUrl && (
          <Image
            src={imageUrl}
            alt="Lampiran"
            width={240}
            height={240}
            className="mb-1 rounded-lg"
          />
        )}
        {content && <p>{content}</p>}
      </div>
    </div>
  );
}
