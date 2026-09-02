"use client";

import { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const MAX_SIZE_BYTES = 2 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function AvatarUpload({
  userId,
  role,
  nama,
  currentUrl,
}: {
  userId: string;
  role: "siswa" | "guru";
  nama: string;
  currentUrl: string | null;
}) {
  const [avatarUrl, setAvatarUrl] = useState(currentUrl);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Format foto harus JPG, PNG, atau WEBP");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      toast.error("Ukuran foto maksimal 2MB");
      return;
    }

    setIsUploading(true);
    try {
      const supabase = createClient();
      const table = role === "siswa" ? "profiles_siswa" : "profiles_guru";
      const ext = file.name.split(".").pop();
      const path = `${userId}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(path);
      const bustedUrl = `${publicUrl}?t=${Date.now()}`;

      const { error: updateError } = await supabase
        .from(table)
        .update({ avatar_url: bustedUrl })
        .eq("id", userId);
      if (updateError) throw updateError;

      setAvatarUrl(bustedUrl);
      toast.success("Foto profil berhasil diperbarui");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Gagal upload foto profil"
      );
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        className="relative group"
        aria-label="Ganti foto profil"
      >
        <Avatar className="h-24 w-24">
          <AvatarImage src={avatarUrl ?? undefined} alt={nama} />
          <AvatarFallback className="text-2xl">
            {nama.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100",
            isUploading && "opacity-100"
          )}
        >
          {isUploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-white" />
          ) : (
            <Camera className="h-6 w-6 text-white" />
          )}
        </div>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
      <p className="text-xs text-muted-foreground">Klik foto untuk mengganti</p>
    </div>
  );
}
