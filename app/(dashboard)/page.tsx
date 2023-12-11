import { Card, CardBody, Link } from "@nextui-org/react";
import { getServerSession } from "next-auth";
import React from "react";
import { MdCode } from "react-icons/md";
import { authOptions } from "../api/auth/[...nextauth]/route";
import prisma from "@/prisma/prisma";

export default async function Index() {
  const session = await getServerSession(authOptions);
  const requests = await prisma.request.findMany({
    where: {
      account: {
        user: {
          username: { equals: session?.user?.email ?? "" },
        },
      },
    },
    include: {
      account: {
        include: {
          bank: true,
        },
      },
    },
    take: 3,
    orderBy: { createdAt: "desc" },
  });
  const accounts = await prisma.account.findMany({
    where: { user: { username: session?.user?.email ?? "" } },
    take: 5,
    orderBy: { bank: { createdAt: "desc" } },
  });

  return (
    <div className="grid md:grid-cols-2 gap-x-16 gap-y-8 py-12">
      <div className="col-span-1">
        <Card className="shadow">
          <CardBody>
            {requests.length <= 0 ? (
              <div className="flex justify-center flex-col items-center py-8">
                <p className="text-8xl text-rose-300 text-center">
                  <MdCode />
                </p>
                <p>Your requests will show here</p>
              </div>
            ) : (
              <>
                <h4 className="font-bold text-xl">Recent requests</h4>

                <div className="mb-4 mt-8">
                  {requests.map((request, id) => (
                    <div
                      key={id}
                      className="border rounded-md p-3 mb-3 last:mb-0"
                    >
                      <Link
                        href={`/requests/${request.code}`}
                        className="flex-col items-start w-full text-black"
                      >
                        <div className="flex justify-between w-full">
                          <h4 className="text-base font-semibold">
                            {request.code}
                          </h4>
                          <h4 className="text-base font-semibold">
                            {request.account.bank.slug.toUpperCase()}
                          </h4>
                        </div>
                        <p className="text-sm">
                          {request.createdAt.toDateString()} &mdash;{" "}
                          {request.status}
                        </p>
                      </Link>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <Link
                    href="/requests"
                    className="font-bold text-lg text-primary"
                  >
                    Show all
                  </Link>
                </div>
              </>
            )}
          </CardBody>
        </Card>
      </div>

      <div className="col-span-1 bg-white">
        <Link
          href="/accounts"
          className="font-bold text-xl text-black hover:underline"
        >
          Linked accounts
        </Link>

        <div className="mb-4 mt-8">
          {accounts.length <= 0 ? (
            <p>No account linked</p>
          ) : (
            accounts.map((account) => (
              <div className="border-b last:border-none" key={account.id}>
                <Link
                  href={`/accounts/${account.id}`}
                  className="flex-col w-full items-start text-black hover:bg-gray-50 p-2"
                >
                  <h4 className="font-semibold text-base">
                    {account.accountName}
                  </h4>
                  <p className="text-sm">
                    {account.accountNumber.toString().slice(0, 4)}
                    {Array.from(
                      { length: account.accountNumber.toString().length - 7 },
                      () => "*"
                    ).join("")}
                    {account.accountNumber
                      .toString()
                      .slice(account.accountNumber.toString().length - 3)}
                  </p>
                </Link>
              </div>
            ))
          )}
        </div>

        <div className="mt-8">
          <Link
            href="/accounts/link"
            className="font-bold text-lg text-primary"
          >
            Link an account
          </Link>
        </div>
      </div>
    </div>
  );
}
