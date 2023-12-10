import { Card, CardBody, Select } from "@nextui-org/react";
import Link from "next/link";
import React from "react";

export default function LinkAccount() {
  return (
    <div className="flex justify-center">
      <div className="w-2/5">
        <Link href="/" className="text-primary">
          &larr; <strong>Back</strong>
        </Link>
        <Card fullWidth={true} className="mt-4">
          <CardBody>
            <h4 className="text-xl font-bold">Link an account</h4>

            <form className="mt-8">
              <fieldset className="mb-3">
                <select name="bank" id="bank" className="form-control">
                  <option value="" selected disabled>
                    --- select bank ---
                  </option>
                  <option value="1">1</option>
                </select>
              </fieldset>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
