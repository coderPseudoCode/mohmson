"use client";

import React from "react";
import { Card, CardBody } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import AuthLoader from "@/components/auth-loader";
import Image from "next/image";

export default function layout({ children }: { children: React.ReactNode }) {
  const { status } = useSession();

  if (status === "loading") {
    return;
  }

  return (
    <AuthLoader goto="/" verb="authenticated">
      <div className="flex min-h-screen w-full justify-center sm:items-center py-10 px-5 sm:px-0 sm:py-4">
        <div className="w-full sm:w-[75%] md:w-[50%] lg:w-[40%] xl:w-[30%] relative">
          <div className="flex justify-center mb-2">
            <Image
              src="/logo.png"
              alt="logo"
              width={96}
              height={96}
              className="shadow border rounded-full"
            />
          </div>
          <Card fullWidth={true} className="shadow-none sm:shadow">
            <CardBody className="p-8">{children}</CardBody>
          </Card>
        </div>
      </div>
    </AuthLoader>
  );
}
