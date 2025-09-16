"use client";
import { ReactNode } from "react";
import { ThemeProvider } from "./theme-provider";
import QueryProvider from "./react-query-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>{children}</QueryProvider>
    </ThemeProvider>
  );
}
