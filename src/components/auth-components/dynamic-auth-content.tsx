"use client";
import {
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const DynamicAuthHeader = () => {
  const pathname = usePathname();
  if (pathname === "/auth/signin") {
    return (
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Sign In</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Enter your email and password to sign in
        </CardDescription>
      </CardHeader>
    );
  }
  if (pathname === "/auth/signup") {
    return (
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Sign Up</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
    );
  }
  return null;
};

function DynamicAuthFooter() {
  const pathname = usePathname();
  if (pathname === "/auth/signin") {
    return (
      <CardFooter className="text-center text-xs md:text-sm">
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/signup"
          className="text-primary hover:underline ml-1 hover:underline-offset-4"
        >
          Sign Up
        </Link>
      </CardFooter>
    );
  }
  if (pathname === "/auth/signup") {
    return (
      <CardFooter className="text-center text-xs md:text-sm">
        Already have an account?{" "}
        <Link
          href="/auth/signin"
          className="text-primary hover:underline ml-1 hover:underline-offset-4"
        >
          Sign In
        </Link>
      </CardFooter>
    );
  }
  return null;
}

export { DynamicAuthHeader, DynamicAuthFooter };
