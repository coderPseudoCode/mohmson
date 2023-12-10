import { Spinner } from "@nextui-org/react";
import React from "react";

export default function Loader() {
  return (
    <div className="flex h-screen w-screen justify-center items-center">
      <Spinner size="lg" />
    </div>
  );
}
