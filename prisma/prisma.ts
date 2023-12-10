import { env } from "@/utils/utils";
import { PrismaClient } from "prisma/prisma-client";

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma ?? new PrismaClient();

if (env.isDevelopment) global.prisma = prisma;

export default prisma;
