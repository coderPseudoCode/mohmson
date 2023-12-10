import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/prisma/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {},
        password: {},
      },
      async authorize(credentials) {
        if (credentials?.username && credentials.password) {
          const got = await prisma.user.findUnique({
            where: { username: credentials.username },
          });

          if (got !== null) {
            const verified = await bcrypt.compare(
              credentials.password,
              got.password
            );

            if (verified) {
              const { password, ...user } = got;
              return {
                id: user.id.toString(),
                email: user.username,
                name: user.fullName,
              };
            }
          }
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
    newUser: "/register",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
