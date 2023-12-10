import { Card, CardBody, Link } from "@nextui-org/react";
import { getServerSession } from "next-auth";
import React from "react";
import { MdCode } from "react-icons/md";
import { authOptions } from "../api/auth/[...nextauth]/route";
import prisma from "@/prisma/prisma";

export default async function Index() {
  const session = await getServerSession(authOptions);
  const activities = [1];
  const accounts = await prisma.account.findMany({
    where: { user: { username: session?.user?.email ?? "" } },
  });

  return (
    <div className="grid md:grid-cols-2 gap-x-16 gap-y-8 py-12">
      <div className="col-span-1">
        <Card className="shadow">
          <CardBody>
            {activities.length <= 0 ? (
              <div className="flex justify-center flex-col items-center py-8">
                <p className="text-8xl text-rose-300 text-center">
                  <MdCode />
                </p>
                <p>Your activities will show here</p>
              </div>
            ) : (
              <>
                <h4 className="font-bold text-xl">Recent activity</h4>

                <div className="mb-4 mt-8">
                  {activities.map((activity, id) => (
                    <div
                      key={id}
                      className="border rounded-md p-3 mb-3 last:mb-0"
                    >
                      <Link
                        href={`/activities/${activity}`}
                        className="flex-col items-start w-full text-black"
                      >
                        <div className="flex justify-between w-full">
                          <h4 className="text-base font-semibold">
                            Transaction type
                          </h4>
                          <h4 className="text-base font-semibold">0.50</h4>
                        </div>
                        <p className="text-sm">Date &mdash; Status</p>
                      </Link>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <Link
                    href="/activities"
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
