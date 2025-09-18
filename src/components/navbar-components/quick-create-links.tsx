"use client";
import { PlusCircleIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Link from "next/link";
import { FORMS_DETAILS } from "@/lib/helpers/render-form-dynamically";

export default function CreateFormQuickLinks() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="size-8 rounded-full shadow-none"
          aria-label="Open create new content"
        >
          <PlusCircleIcon
            className="text-muted-foreground"
            size={16}
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="border bg-card">
        {[
          FORMS_DETAILS.map((l) => (
            <DropdownMenuItem asChild>
              <Link href={`/create/${l.name}`} key={l.title}>
                <span> {l.title}</span>
              </Link>
            </DropdownMenuItem>
          )),
        ]}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
