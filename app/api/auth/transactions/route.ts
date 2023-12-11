import { requestSchema } from "@/schemas/request-schema";
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";
import prisma from "@/prisma/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const parsed = await requestSchema.safeParseAsync(data);

    if (!parsed.success) {
      return new Response(JSON.stringify(parsed.error.format()), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const account = await prisma.account.findUnique({
      where: { accountNumber: parsed.data.accountNumber },
      include: { user: true, bank: true },
    });

    const _data: requestInitType = {
      ...parsed.data,
      bankName: account?.bank.name ?? "",
      username: account?.user.username ?? "",
      accountId: account?.id ?? 0,
    };

    global.webs?.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(_data), (err) => {
          console.log(err);
        });
      }
    });
    const granted = false;
    return new Response(
      JSON.stringify({
        granted,
        message: "",
        timestamps: Date.now(),
      }),
      {
        status: granted ? 200 : 401,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ message: error, success: false }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

export type requestInitType = {
  amount: number;
  accountNumber: string;
  bankName: string;
  username: string;
  bankSlug: string;
  accountId: number;
};
