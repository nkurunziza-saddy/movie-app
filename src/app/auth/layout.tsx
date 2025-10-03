import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  DynamicAuthFooter,
  DynamicAuthHeader,
} from "@/components/auth-components/dynamic-auth-content";
import Logo from "@/components/navbar-components/logo";
import Link from "next/link";
const layout = (props: LayoutProps<"/auth">) => {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center px-1 py-4 sm:p-4 z-50">
      <div className="flex flex-col gap-4 min-h-screen w-full items-center justify-center px-1 py-4 sm:p-4">
        <div className="flex gap-2 items-center relative">
          <Link href={"/"} className="inset-0 absolute" />
          <Logo />
          <h2 className="text-lg font-semibold ">AllMovies</h2>
        </div>
        <Card className="w-full sm:max-w-md">
          <DynamicAuthHeader />
          <CardContent>{props.children}</CardContent>
          <DynamicAuthFooter />
        </Card>
      </div>
    </div>
  );
};

export default layout;
