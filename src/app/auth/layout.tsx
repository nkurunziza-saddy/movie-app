import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DynamicAuthFooter, DynamicAuthHeader } from "./dynamic-auth-content";
const layout = (props: LayoutProps<"/auth">) => {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center p-4 z-50">
      <div className="flex min-h-screen w-full items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <DynamicAuthHeader />
          <CardContent>{props.children}</CardContent>
          <DynamicAuthFooter />
        </Card>
      </div>
    </div>
  );
};

export default layout;
