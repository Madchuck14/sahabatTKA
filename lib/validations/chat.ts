import { z } from "zod";

export const sendMessageSchema = z.object({
  content: z.string().trim().max(2000).optional(),
  imageUrl: z.string().url().optional(),
});

export const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  komentar: z.string().max(500).optional(),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
