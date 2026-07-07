import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(3),
  phone: z.string().optional(),
  bio: z.string().optional(),
});

export type UpdateProfilePayload =
  z.infer<typeof updateProfileSchema>;