"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  const getSonnerTheme = (currentTheme: string): ToasterProps["theme"] => {
    if (currentTheme === "light" || currentTheme === "system") {
      return currentTheme as ToasterProps["theme"];
    }

    return "dark";
  };

  return (
    <Sonner
      theme={getSonnerTheme(theme)}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
