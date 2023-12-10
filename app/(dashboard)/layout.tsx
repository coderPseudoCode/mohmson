"use client";

import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
} from "@nextui-org/react";
import React from "react";
import { useSession, signOut } from "next-auth/react";
import AuthLoader from "@/components/auth-loader";

export default function layout({ children }: { children: React.ReactNode }) {
  const { data } = useSession();

  return (
    <AuthLoader goto="/login" verb="unauthenticated">
      <Navbar maxWidth="full">
        <NavbarBrand>
          <Image src="logo.png" alt="logo" width={40} height={40} />

          <Link href="/" className="font-semibold text-lg text-secondary">
            Authenticator
          </Link>
        </NavbarBrand>

        <NavbarContent as="div" justify="end">
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="secondary"
                name={data?.user?.name ?? ""}
                size="sm"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="user" className="h-14 gap-2">
                <p className="font-semibold text-sm">Signed in as</p>
                <p className="font-semibold">{data?.user?.name}</p>
              </DropdownItem>
              <DropdownItem key="profile" href="/profile">
                Profile
              </DropdownItem>
              <DropdownItem key="requests" href="/requests">
                Authorised Requests
              </DropdownItem>
              <DropdownItem key="accounts" href="/accounts">
                Linked Accounts
              </DropdownItem>
              <DropdownItem
                key="logout"
                onClick={() => {
                  signOut({ redirect: true, callbackUrl: "/login" });
                }}
                color="danger"
              >
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      </Navbar>
      <div className="flex justify-center">
        <div className="container">{children}</div>
      </div>
    </AuthLoader>
  );
}
