import React from "react";
import AuthLoader from "@/components/auth-loader";
import NavBar from "@/components/navbar";
import CreateWebSocket from "@/utils/ws";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  await CreateWebSocket();

  return (
    <AuthLoader goto="/login" verb="unauthenticated">
      <NavBar />
      <div className="flex justify-center">
        <div className="container">{children}</div>
      </div>
    </AuthLoader>
  );
}
