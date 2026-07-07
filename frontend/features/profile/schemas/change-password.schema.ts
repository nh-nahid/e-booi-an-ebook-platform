import { z } from "zod";

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(6),
  newPassword: z.string().min(6),
});

export type ChangePasswordPayload =
  z.infer<typeof changePasswordSchema>;