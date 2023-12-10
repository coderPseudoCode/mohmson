import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string({ required_error: "Username is required" })
    .min(1, "Username is required")
    .min(3, "Username must be at least 3 characters"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 character"),
});

export type loginType = z.infer<typeof loginSchema>;
