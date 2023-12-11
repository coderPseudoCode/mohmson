"use server";

import { requestInitType } from "@/app/api/auth/transactions/route";
import prisma from "@/prisma/prisma";
import { revalidatePath } from "next/cache";

export default async function createRequest(
  request: requestInitType,
  authorise: boolean
) {
  try {
    await prisma.request.create({
      data: {
        expiresAt: new Date(),
        accountId: request.accountId,
        isApproved: authorise,
        isExpired: true,
        status: authorise ? "approved" : "declined",
        code: Math.floor(Math.random() * 9999999) + 1111111,
      },
    });

    revalidatePath("/");

    return { message: "Success", success: true };
  } catch (error) {
    return { message: JSON.stringify(error), success: false };
  }
}
