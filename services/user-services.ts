"use server";

import { userSchema, userType } from "@/schemas/register-schema";
import bcrypt from "bcrypt";
import prisma from "@/prisma/prisma";

async function exists(user: userType) {
  let got = await prisma.user.findFirst({
    where: { username: { equals: user.username } },
  });

  if (got !== null) {
    return {
      exists: true,
      field: "username",
      message: "Username already taken",
    };
  }

  got = await prisma.user.findFirst({
    where: { phoneNumber: { equals: Number(user.phoneNumber) } },
  });

  return got !== null
    ? {
        exists: true,
        field: "phoneNumber",
        message: "User exists with phone number",
      }
    : { exists: false };
}

export async function registerUser(user: userType) {
  try {
    await userSchema.parseAsync(user);

    const validate = await exists(user);

    if (validate.exists) {
      return {
        message: validate.message,
        success: false,
        field: validate.field,
      };
    }

    const { confirmPassword, ...data } = user;
    data.password = await bcrypt.hash(data.password, 10);

    await prisma.user.create({
      data: { ...data, phoneNumber: Number(data.phoneNumber) },
    });

    return { message: "Success", success: true };
  } catch (error) {
    return { message: "An error was encountered", success: false };
  }
}
