"use client";

import { loginSchema, loginType } from "@/schemas/login-schema";

import React from "react";
import { Button, Link } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<loginType>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: loginType) => {
    const logged = await signIn("credentials", {
      ...data,
      redirect: false,
    });

    if (!logged?.ok) {
      return toast.error("Incorrect username or password");
    }

    router.replace("/");
  };

  return (
    <>
      <div className="mb-10">
        <h4 className="text-2xl font-bold">Login</h4>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="mb-3">
          <input
            {...register("username", { required: true })}
            type="text"
            autoFocus={true}
            placeholder="Username"
            className={`form-control ${
              errors.username ? "border-danger" : "focus:border-primary"
            }`}
          />
          <small className="text-danger">{errors.username?.message}</small>
        </fieldset>

        <fieldset>
          <input
            type="password"
            placeholder="Password"
            className={`form-control ${
              errors.password ? "border-danger" : "focus:border-primary"
            }`}
            {...register("password", { required: true })}
          />
          {errors.password && (
            <small className="text-danger">{errors.password.message}</small>
          )}
        </fieldset>
        <div className="mb-8">
          <Link href="/auth/recovery">Forgot password?</Link>
        </div>

        <Button
          isDisabled={isSubmitting}
          isLoading={isSubmitting}
          type="submit"
          fullWidth={true}
          variant="solid"
          color="primary"
        >
          <strong>Login</strong>
        </Button>
        <p className="text-center m-1 mb-0">
          Do not have an account? <Link href="/register">Register</Link>
        </p>
      </form>
    </>
  );
}
