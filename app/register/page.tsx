"use client";

import React, { useState } from "react";
import { Button, Link } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema, userType } from "./register-schema";
import { registerUser } from "@/services/user-services";
import { toast } from "react-toastify";
import { BiCheckCircle } from "react-icons/bi";
import { signIn } from "next-auth/react";

export default function Register() {
  const [success, setSuccess] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isLoading },
  } = useForm<userType>({ resolver: zodResolver(userSchema) });

  const onSubmit = async (data: userType) => {
    const created = await registerUser(data);

    if (!created.success) {
      if (created.field) {
        switch (created.field) {
          case "username":
            return setError("username", { message: created.message });
          case "phoneNumber":
            return setError("phoneNumber", { message: created.message });
          default:
            return;
        }
      }

      return toast.error(created.message);
    }

    setSuccess(() => {
      setTimeout(async () => {
        await signIn("credentials", {
          username: data.username,
          password: data.password,
          redirect: true,
          callbackUrl: "/",
        });
      }, 2000);
      return true;
    });
  };

  return success ? (
    <div className="text-center flex flex-col items-center">
      <p className="text-8xl mb-3 text-success">
        <BiCheckCircle />
      </p>
      <p className="text-2xl font-bold text-success">
        Account created successfully
      </p>
      <em className="text-blue-300">You will be redirected shortly...</em>
    </div>
  ) : (
    <>
      <div className="mb-10">
        <h4 className="text-2xl font-bold">Create Account</h4>
        <p className="m-0">Complete the form to create your auth account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="mb-3">
          <input
            type="text"
            {...register("fullName", { required: true })}
            autoFocus={true}
            placeholder="Full name"
            className={`form-control ${
              errors.fullName ? "border-danger" : "focus:border-primary"
            }`}
          />
          <small className="text-danger">{errors.fullName?.message}</small>
        </fieldset>

        <fieldset className="mb-3">
          <input
            type="number"
            {...register("phoneNumber", { required: true })}
            placeholder="Phone number"
            className={`form-control ${
              errors.phoneNumber ? "border-danger" : "focus:border-primary"
            }`}
          />
          <small className="text-danger">{errors.phoneNumber?.message}</small>
        </fieldset>

        <fieldset className="mb-3">
          <input
            type="text"
            {...register("username", { required: true })}
            placeholder="Username"
            className={`form-control ${
              errors.username ? "border-danger" : "focus:border-primary"
            }`}
          />
          <small className="text-danger">{errors.username?.message}</small>
        </fieldset>

        <fieldset className="mb-3">
          <input
            type="password"
            {...register("password", { required: true })}
            placeholder="Create new password"
            className={`form-control ${
              errors.password ? "border-danger" : "focus:border-primary"
            }`}
          />
          <small className="text-danger">{errors.password?.message}</small>
        </fieldset>

        <fieldset className="mb-8">
          <input
            type="password"
            {...register("confirmPassword", { required: true })}
            placeholder="Confirm new password"
            className={`form-control ${
              errors.confirmPassword ? "border-danger" : "focus:border-primary"
            }`}
          />
          <small className="text-danger">
            {errors.confirmPassword?.message}
          </small>
        </fieldset>

        <Button
          isDisabled={isLoading}
          isLoading={isLoading}
          type="submit"
          fullWidth={true}
          variant="solid"
          color="primary"
        >
          <strong>Create Account</strong>
        </Button>
        <p className="text-center m-1 mb-0">
          Already have an account? <Link href="/login">Login</Link>
        </p>
      </form>
    </>
  );
}
