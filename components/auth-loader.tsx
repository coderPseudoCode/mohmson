"use client";

import { useSession } from "next-auth/react";
import React from "react";
import Loader from "@/app/loader";
import { useRouter } from "next/navigation";

export default function AuthLoader({
  children,
  goto,
  verb,
}: {
  children: React.ReactNode;
  goto: string;
  verb: "authenticated" | "unauthenticated";
}) {
  const { status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <Loader />;
  } else if (status === verb) {
    return router.replace(goto);
  }
  return children;
}
