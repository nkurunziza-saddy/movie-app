"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { THEME_OPTIONS } from "@/lib/config";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export function ThemeTogglerResponsive() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { resolvedTheme, setTheme } = useTheme();

  const themeOptions = ["system", ...THEME_OPTIONS];

  const themeButtons = (
    <div className="flex flex-col gap-0.5">
      {themeOptions.map((option) => (
        <Button
          key={option}
          variant={resolvedTheme === option ? "secondary" : "ghost"}
          size={"sm"}
          onClick={() => {
            setTheme(option);
          }}
          className={cn(
            resolvedTheme === option
              ? "bg-none text-foreground-foreground border-2"
              : "",
            "hover:bg-transparent w-fit hover:text-foreground/70 cursor-pointer"
          )}
          aria-label={`Select ${option} theme`}
        >
          <span className="capitalize">{option}</span>
        </Button>
      ))}
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Themes</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Select Theme</DialogTitle>
            <DialogDescription>
              Choose a theme for the application.
            </DialogDescription>
          </DialogHeader>
          {themeButtons}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Themes</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Select Theme</DrawerTitle>
          <DrawerDescription>
            Choose a theme for the application.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4">{themeButtons}</div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
