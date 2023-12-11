import React from "react";
import prisma from "@/prisma/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Link } from "@nextui-org/react";

export default async function RequestDetails({
  params,
}: {
  params: { code: number };
}) {
  const session = await getServerSession(authOptions);
  const request = await prisma.request.findUnique({
    where: {
      code: Number(params.code),
      account: {
        user: { username: session?.user?.email ?? "" },
      },
    },
    include: {
      account: {
        include: {
          bank: true,
        },
      },
    },
  });

  return request === null ? (
    <p>No request found</p>
  ) : (
    <div className="flex justify-center py-5">
      <div className="w-2/4 bg-white flex flex-col">
        <div className="mb-6 border-b pb-1">
          <Link href="/requests" className="mb-3">
            &larr; <strong>Requests</strong>
          </Link>
          <h4 className="text-xl font-extrabold">Request Details</h4>
          <p>{request.code}</p>
        </div>

        <section id="request-details">
          <table>
            <tbody>
              <tr>
                <td>Request code:</td>
                <td>{request.code}</td>
              </tr>

              <tr>
                <td>Bank name:</td>
                <td>{request.account.bank.name}</td>
              </tr>

              <tr>
                <td>Created at:</td>
                <td>{request.createdAt.toUTCString()}</td>
              </tr>

              <tr>
                <td>Expires at:</td>
                <td>{request.expiresAt.toUTCString()}</td>
              </tr>

              <tr>
                <td>Status</td>
                <td>{request.status}</td>
              </tr>

              <tr>
                <td>Is approved</td>
                <td>{request.isApproved ? "Yes" : "No"}</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
