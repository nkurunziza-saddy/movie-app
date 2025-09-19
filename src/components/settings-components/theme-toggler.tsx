"use client";

import { useTheme } from "next-themes";
import { THEME_OPTIONS } from "@/lib/config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export function ThemeToggler() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {["system", ...THEME_OPTIONS].map((option) => (
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
      </CardContent>
    </Card>
  );
}
