import { z } from "zod";

export const jenjangEnum = z.enum(["SD", "SMP", "SMA", "SMK"]);

export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const registerSiswaSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  nama: z.string().min(1, "Nama wajib diisi"),
  nis: z.string().min(1, "NIS wajib diisi"),
  umur: z.coerce
    .number({ message: "Umur wajib diisi" })
    .int()
    .min(5, "Umur minimal 5 tahun")
    .max(25, "Umur maksimal 25 tahun"),
  alamat: z.string().min(1, "Alamat wajib diisi"),
  jenjang: jenjangEnum,
  kelas: z.string().min(1, "Kelas wajib diisi"),
});

export const registerGuruSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  nama: z.string().min(1, "Nama wajib diisi"),
  gelar: z.string().optional(),
  umur: z.coerce.number().int().positive().optional(),
  alamat: z.string().optional(),
  jenjang: jenjangEnum,
  subjectIds: z.array(z.string().uuid()).min(1, "Pilih minimal 1 mata pelajaran"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterSiswaInput = z.infer<typeof registerSiswaSchema>;
export type RegisterGuruInput = z.infer<typeof registerGuruSchema>;
