import { z } from "zod";

export const userSchema = z
  .object({
    fullName: z
      .string()
      .min(1, "Full name is required")
      .min(3, "Full name must be at least 3 characters"),
    username: z
      .string()
      .min(1, "Username is required")
      .min(3, "Username must be at least 3 characters"),
    phoneNumber: z
      .string()
      .min(1, "Phone number is required")
      .min(9, "Phone must be at least 9 characters"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Full name must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine(({ confirmPassword, password }) => password === confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type userType = z.infer<typeof userSchema>;
