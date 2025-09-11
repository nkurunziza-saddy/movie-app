import * as React from "react";
import { cn } from "@/lib/utils";

function TextContainer({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="title-container"
      className={cn("flex flex-col gap-1 mb-5", className)}
      {...props}
    />
  );
}

function TextTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "text-2xl font-bold leading-tight tracking-tight text-primary",
        className
      )}
      {...props}
    />
  );
}

function TextDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-base text-muted-foreground", className)}
      {...props}
    />
  );
}

function TextFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center justify-between border-t border-border pt-4 mt-4 text-sm text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

export { TextContainer, TextTitle, TextDescription, TextFooter };
