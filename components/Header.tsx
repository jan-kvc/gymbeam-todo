"use client";

import { ClerkLoading, SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import ColorSchemeSwitch from "./ColorSchemeSwitch";
import { LoadingSpinner } from "./icons/LoadingSpinner";
import MountainIcon from "./icons/MountainIcon";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
} from "@nextui-org/navbar";
import { useMenu } from "./MobileMenuContext";
export default function Header({
  mobileContentInMenu,
}: {
  mobileContentInMenu: React.ReactNode;
}) {
  const { isMenuOpen, setIsMenuOpen } = useMenu();
  return (
    <Navbar
      maxWidth="full"
      className="sticky w-full top-0 z-10 border-b bg-primary-foreground py-3"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className="flex items-center gap-4">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <Link
          href="#"
          className="flex items-center gap-2 text-lg font-semibold"
          prefetch={false}
        >
          <NavbarBrand className="hidden sm:block">
            <MountainIcon className="h-6 w-6" />
            <span className="sr-only">Gymbeam TodoApp</span>
          </NavbarBrand>
        </Link>
        <nav className="hidden gap-6 text-sm font-medium sm:flex justify-center">
          <Link
            href="#"
            className="transition-colors hover:text-primary"
            prefetch={false}
          >
            Gymbeam TodoApp
          </Link>
          <Link
            href="#"
            className="transition-colors hover:text-primary"
            prefetch={false}
          >
            TBA
          </Link>
          <Link
            href="#"
            className="transition-colors hover:text-primary"
            prefetch={false}
          >
            TBA
          </Link>
        </nav>
      </NavbarContent>
      <NavbarContent justify="end" className="flex items-center gap-6">
        <SignedIn>
          <ClerkLoading>
            <LoadingSpinner className="h-7 w-7 text-primary" />
          </ClerkLoading>
          <UserButton />
        </SignedIn>
        <ColorSchemeSwitch />
      </NavbarContent>
      <NavbarMenu className="flex flex-col gap-4 sm:hidden pt-8">
        <div>{mobileContentInMenu}</div>
      </NavbarMenu>
    </Navbar>
  );
}
