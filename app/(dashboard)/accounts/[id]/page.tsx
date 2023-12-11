import React from "react";
import prisma from "@/prisma/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Link } from "@nextui-org/react";

export default async function AccountDetails({
  params,
}: {
  params: { id: number };
}) {
  const session = await getServerSession(authOptions);
  const account = await prisma.account.findUnique({
    where: {
      id: Number(params.id),
      user: { username: session?.user?.email ?? "" },
    },
    include: {
      bank: true,
      requests: true,
    },
  });

  return account === null ? (
    <p>No account found</p>
  ) : (
    <div className="flex justify-center py-5">
      <div className="w-2/4 bg-white flex flex-col">
        <div className="mb-6 border-b pb-1">
          <Link href="/accounts" className="mb-3">
            &larr; <strong>Accounts</strong>
          </Link>
          <h4 className="text-xl font-extrabold">Account Details</h4>
          <p>{account.accountName}</p>
        </div>

        <section id="account-details">
          <table>
            <tbody>
              <tr>
                <td>Account number:</td>
                <td>{account.accountNumber}</td>
              </tr>

              <tr>
                <td>Bank name:</td>
                <td>{account.bank.name}</td>
              </tr>

              <tr>
                <td>Created at:</td>
                <td>{account.createdAt.toUTCString()}</td>
              </tr>
            </tbody>
          </table>

          <p className="font-semibold text-gray-600 mt-3">Requests</p>
          {account.requests.length <= 0 ? (
            <small>
              <em>No requests for this account</em>
            </small>
          ) : (
            <div className="flex flex-col mt-2">
              {account.requests.map((request) => (
                <Link
                  href={`/activities/${request.code}`}
                  key={request.code}
                  className="flex-col text-black items-start hover:bg-gray-200 py-1 px-3 border-b last:border-none"
                >
                  <p className="font-semibold">{request.code}</p>
                  <p>
                    {request.createdAt.toDateString()} &mdash; {request.status}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
