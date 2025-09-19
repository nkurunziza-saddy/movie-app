"use client";

import { useTheme } from "next-themes";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { THEME_OPTIONS } from "@/lib/config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";

export function ThemeToggler() {
  const { theme, setTheme } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {THEME_OPTIONS.map((option) => (
            <Button
              key={option}
              variant={"ghost"}
              size={"sm"}
              onClick={() => {
                setTheme(option);
              }}
              className={
                theme === option
                  ? "bg-accent text-accent-foreground border"
                  : ""
              }
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
