import React from "react";
import prisma from "@/prisma/prisma";
import { Link } from "@nextui-org/react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { MdCode } from "react-icons/md";

export default async function Accounts() {
  const session = await getServerSession(authOptions);

  const accounts = await prisma.account.findMany({
    where: { user: { username: { equals: session?.user?.email ?? "" } } },
    include: {
      bank: true,
    },
  });

  return (
    <div className="flex justify-center py-5">
      <div className="w-2/4 bg-white flex flex-col">
        <div className="mb-6">
          <Link href="/" className="mb-1">
            &larr; <strong>Home</strong>
          </Link>
          <h4 className="text-xl font-extrabold">Linked Accounts</h4>
        </div>
        {accounts.length <= 0 ? (
          <div className="text-center flex flex-col items-center">
            <p className="text-6xl text-danger-200">
              <MdCode />
            </p>
            <em>No account has been linked</em>
            <Link href="/accounts/link">Link an account</Link>
          </div>
        ) : (
          accounts.map((account) => (
            <Link
              key={account.id}
              href={`accounts/${account.id}`}
              className="border-b py-2 px-3 items-start flex flex-col text-black hover:bg-gray-100"
            >
              <h4 className="text-lg font-semibold">{account.accountName}</h4>
              <p>{account.bank.name}</p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
