"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";

import MountainIcon from "@/components/icons/MountainIcon";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
  return (
    <SignIn.Root>
      <SignIn.Step name="start">
        <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-md space-y-6">
            <div className="flex flex-col items-center space-y-2">
              <MountainIcon className="h-12 w-12 text-primary" />
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Gymbeam TodoApp
              </h1>
              <p className="text-muted-foreground">
                Sign in to access your account and start doing.
              </p>
              <Clerk.GlobalError className="block text-sm text-red-400" />
            </div>
            <div className="space-y-4">
              <Button variant="outline" className="w-full">
                <ChromeIcon className="mr-2 h-5 w-5" />
                <Clerk.Connection name="google">
                  Sign in with Google
                </Clerk.Connection>
              </Button>
              <Button variant="outline" className="w-full">
                <AppleIcon className="mr-2 h-5 w-5" />
                <Clerk.Connection name="apple">
                  Sign in with Apple
                </Clerk.Connection>
              </Button>
            </div>
          </div>
        </div>
      </SignIn.Step>
    </SignIn.Root>
  );
}

function AppleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
      <path d="M10 2c1 .5 2 2 2 5" />
    </svg>
  );
}

function ChromeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="21.17" x2="12" y1="8" y2="8" />
      <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
      <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
    </svg>
  );
}
