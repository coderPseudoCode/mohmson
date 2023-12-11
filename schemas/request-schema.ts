import { z } from "zod";
import prisma from "@/prisma/prisma";

export const requestSchema = z
  .object({
    amount: z.number({ required_error: "Provide transaction amount" }),
    bankSlug: z.string({ required_error: "Provide bank slug/acronym" }),
    accountNumber: z.string({ required_error: "Provide account number" }),
  })
  .refine(
    async (data) => {
      const bank = await prisma.bank.findUnique({
        where: { slug: data.bankSlug },
      });

      return bank !== null;
    },
    { message: "Invalid bank slug/acronym" }
  )
  .refine(
    async (data) => {
      const bank = await prisma.bank.findUnique({
        where: { slug: data.bankSlug },
      });

      return (
        bank !== null && bank.accountNumberLength === data.accountNumber.length
      );
    },
    { message: "Invalid bank account number" }
  )
  .refine(
    async (data) => {
      const account = await prisma.account.findUnique({
        where: { accountNumber: data.accountNumber },
      });

      return account !== null;
    },
    { message: "Account number not found" }
  );
