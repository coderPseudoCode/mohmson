import { z } from "zod";

export const bankSchema = z.object({
  bankId: z.string().min(1, "Bank Id is required"),
  accountNumber: z
    .string()
    .min(1, "Account number is required")
    .min(15, "Account number must be at least 15 character"),
  accountName: z
    .string()
    .min(1, "Account name is required")
    .min(3, "Account name must be at least 3 characters"),
  bankCode: z.string().min(1, "Bank code is required"),
  userId: z.string().min(1, "User Id is required"),
});

export type bankType = z.infer<typeof bankSchema>;
