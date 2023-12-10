"use client";

import { bankSchema, bankType } from "@/schemas/bank-schema";
import { linkAccount } from "@/services/account-services";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Bank } from "prisma/prisma-client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function LinkAccountForm({ banks }: { banks: Bank[] }) {
  const { data: user } = useSession();
  const router = useRouter();

  const [selectedBank, setSelectedBank] = useState<Bank>(banks[0]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<bankType>({ resolver: zodResolver(bankSchema) });

  function handleSelectBank({ target }: { target: any }) {
    const value: number = target?.value;
    const bank = banks.find((b) => b.id === Number(value));
    setSelectedBank((prev) => bank ?? prev);
  }

  const onSubmit = async (data: bankType) => {
    const res = await linkAccount(data);

    if (res.success) {
      router.replace("/accounts");
    }

    toast(res.message, { type: res.success ? "success" : "error" });
  };

  console.log(selectedBank);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        type="hidden"
        {...register("userId", { required: true })}
        defaultValue={user?.user?.email ?? ""}
      />
      {errors.userId && (
        <small className="text-danger">{errors.userId.message}</small>
      )}
      <fieldset className="mb-3">
        <select
          {...register("bankId", { required: true })}
          onChange={handleSelectBank}
          className={`form-control ${
            errors?.bankId ? "border-danger" : "focus:border-primary"
          }`}
          value={selectedBank.id}
        >
          {banks.map((bank) => (
            <option value={bank.id} key={bank.id}>
              {bank.name}
            </option>
          ))}
        </select>
        {errors?.bankId && (
          <small className="text-danger">{errors?.bankId?.message}</small>
        )}
      </fieldset>

      <fieldset className="mb-3">
        <input
          {...register("accountNumber", { required: true })}
          maxLength={selectedBank?.accountNumberLength}
          onKeyDown={(key) => {
            const isDigit = Number.isInteger(Number(key.key));

            if (!isDigit && key.key !== "Backspace") {
              key.preventDefault();
            }

            return isDigit;
          }}
          type="text"
          className={`form-control ${
            errors?.accountNumber ? "border-danger" : "focus:border-primary"
          }`}
          placeholder="Account number"
        />

        {errors?.accountNumber && (
          <small className="text-danger">
            {errors?.accountNumber?.message}
          </small>
        )}
      </fieldset>

      <fieldset className="mb-3">
        <input
          {...register("accountName", { required: true })}
          type="text"
          className={`form-control ${
            errors?.accountName ? "border-danger" : "focus:border-primary"
          }`}
          placeholder="Account name"
        />

        {errors?.accountName && (
          <small className="text-danger">{errors?.accountName?.message}</small>
        )}
      </fieldset>

      <fieldset className="mb-3">
        <input
          {...register("bankCode", { required: true })}
          type="text"
          className={`form-control ${
            errors?.bankCode ? "border-danger" : "focus:border-primary"
          }`}
          placeholder="Bank code"
        />

        {errors?.bankCode && (
          <small className="text-danger">{errors?.bankCode?.message}</small>
        )}
      </fieldset>

      <Button
        type="submit"
        isDisabled={isSubmitting}
        isLoading={isSubmitting}
        color="primary"
        fullWidth={true}
      >
        <strong>Link Account</strong>
      </Button>
    </form>
  );
}
