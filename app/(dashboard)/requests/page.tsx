import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import React from "react";
import { MdCode } from "react-icons/md";
import prisma from "@/prisma/prisma";
import { Link } from "@nextui-org/react";

export default async function Requests() {
  const session = await getServerSession(authOptions);

  const requests = await prisma.request.findMany({
    where: {
      account: { user: { username: { equals: session?.user?.email ?? "" } } },
    },
    include: {
      account: {
        include: {
          bank: true,
        },
      },
    },
  });
  return (
    <div className="flex justify-center py-5">
      <div className="w-2/4 bg-white flex flex-col">
        <div className="mb-6">
          <Link href="/" className="mb-1">
            &larr; <strong>Home</strong>
          </Link>
          <h4 className="text-xl font-extrabold">Requests</h4>
        </div>
        {requests.length <= 0 ? (
          <div className="text-center flex flex-col items-center">
            <p className="text-6xl text-danger-200">
              <MdCode />
            </p>
            <em>No request has been linked</em>
            <Link href="/request/link">Link an request</Link>
          </div>
        ) : (
          requests.map((request) => (
            <Link
              href={`request/${request.code}`}
              key={request.code}
              className="border-b py-2 px-3 items-start flex flex-col text-black hover:bg-gray-100"
            >
              <div className="flex justify-between w-full">
                <h4 className="text-lg font-semibold">{request.code}</h4>
                <h4 className="text-lg font-semibold text-danger">
                  {request.account.bank.slug.toUpperCase()}
                </h4>
              </div>
              <p>
                {request.createdAt.toDateString()} &mdash; {request.status}
              </p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
