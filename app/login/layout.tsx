import React from "react";
import { Card, CardBody } from "@nextui-org/react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full justify-center sm:items-center py-10 px-5 sm:px-0 sm:py-0">
      <div className="w-full sm:w-[75%] md:w-[50%] lg:w-[40%] xl:w-[30%]">
        <Card fullWidth={true} className="shadow-none sm:shadow">
          <CardBody className="p-8">{children}</CardBody>
        </Card>
      </div>
    </div>
  );
}
