"use server";

import { bankType } from "@/schemas/bank-schema";
import prisma from "@/prisma/prisma";

export async function linkAccount(data: bankType) {
  try {
    const bank = await prisma.bank.findUnique({
      where: { id: Number(data.bankId) },
    });
    if (bank === null) {
      return {
        message: `Cannot find a bank with the Id '${data.bankId}'`,
        success: false,
      };
    }

    if (data.accountNumber.length !== bank.accountNumberLength) {
      return {
        message: `Invalid account number for bank '${bank.slug}'`,
        success: false,
      };
    }

    const bankCode = await prisma.bankCode.findUnique({
      where: {
        id: data.bankCode,
        bankId: bank.id,
        accountNumber: data.accountNumber,
      },
    });

    if (bankCode === null) {
      return {
        message: `Invalid bank code for bank '${bank.slug}' and account number ${data.accountNumber}`,
        success: false,
      };
    }

    await prisma.account.create({
      data: {
        accountNumber: data.accountNumber,
        bankId: bank.id,
        userId: data.userId,
        accountName: data.accountName,
      },
    });

    return {
      message: `Account '${data.accountNumber}' linked for bank ${bank.slug}`,
      success: true,
    };
  } catch (error) {
    return { message: JSON.stringify(error), success: false };
  }
}
