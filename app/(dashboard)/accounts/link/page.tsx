import { Card, CardBody, Link } from "@nextui-org/react";
import React from "react";
import prisma from "@/prisma/prisma";
import LinkAccountForm from "./form";

export default async function LinkAccount() {
  const banks = await prisma.bank.findMany();

  return (
    <div className="flex justify-center px-4 sm:px-0">
      <div className="w-full sm:w-2/3 md:w-2/4 lg:w-2/5 xl:w-2/6">
        <Link href="/" className="text-primary">
          &larr; <strong>Back</strong>
        </Link>
        {banks.length <= 0 ? (
          <p>No bank has been integrated</p>
        ) : (
          <Card fullWidth={true} className="mt-4">
            <CardBody className="p-8">
              <h4 className="text-xl font-bold">Link an account</h4>

              <div className="mb-2 mt-6">
                <LinkAccountForm banks={banks} />
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}
