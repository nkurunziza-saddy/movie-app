"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Command as CommandPrimitive } from "cmdk";
import { Check, ChevronDown, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./command";

const SearchSelect = Popover;

function SearchSelectTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return (
    <PopoverTrigger asChild {...props}>
      <Button
        variant="outline"
        role="combobox"
        className={cn("w-[200px] justify-between", className)}
      >
        {children}
        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
  );
}

function SearchSelectValue({
  className,
  placeholder,
  children,
  ...props
}: React.ComponentProps<"span"> & {
  placeholder?: string;
}) {
  return (
    <span
      className={cn(
        "pointer-events-none truncate",
        !children && "text-muted-foreground",
        className
      )}
      {...props}
    >
      {children || placeholder}
    </span>
  );
}

function SearchSelectContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverContent
      className={cn("w-[--radix-popover-trigger-width] p-0", className)}
      {...props}
    >
      <Command>{children}</Command>
    </PopoverContent>
  );
}

function SearchSelectInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
      <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
      <CommandPrimitive.Input
        className={cn(
          "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    </div>
  );
}

function SearchSelectList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandList
      className={cn(
        "max-h-[300px] overflow-y-auto overflow-x-hidden",
        className
      )}
      {...props}
    />
  );
}

function SearchSelectEmpty(
  props: React.ComponentProps<typeof CommandPrimitive.Empty>
) {
  return <CommandEmpty className="py-6 text-center text-sm" {...props} />;
}

function SearchSelectGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return <CommandGroup className={cn("", className)} {...props} />;
}

function SearchSelectGroupLabel({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "px-2 py-1.5 text-xs font-medium text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

function SearchSelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandItem className={cn("", className)} {...props}>
      {children}
    </CommandItem>
  );
}

function SearchSelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandSeparator
      className={cn("-mx-1 my-1 h-px bg-muted", className)}
      {...props}
    />
  );
}

export {
  SearchSelect,
  SearchSelectTrigger,
  SearchSelectValue,
  SearchSelectContent,
  SearchSelectInput,
  SearchSelectList,
  SearchSelectEmpty,
  SearchSelectGroup,
  SearchSelectGroupLabel,
  SearchSelectItem,
  SearchSelectSeparator,
};
