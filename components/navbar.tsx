"use client";

import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
} from "@nextui-org/react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";

function NavBar() {
  const { data } = useSession();
  return (
    <Navbar maxWidth="full">
      <NavbarBrand>
        <Image src="/logo.png" alt="logo" width={40} height={40} />

        <Link href="/" className="font-semibold text-lg text-secondary ms-2">
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
              Requests
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
  );
}

export default NavBar;
