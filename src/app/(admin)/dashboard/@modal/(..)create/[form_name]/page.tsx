"use client";

import {
  FORMS_DETAILS,
  renderForm,
} from "@/lib/helpers/render-form-dynamically";
import { buttonVariants } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Modal() {
  const { form_name } = useParams();
  const router = useRouter();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        router.back();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [router]);

  if (!form_name) {
    notFound();
  }

  const formInfo = FORMS_DETAILS.find((m) => m.name == form_name);

  if (!formInfo) {
    notFound();
  }

  return (
    <div className="relative">
      <div className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50 backdrop-blur-xs" />

      <div className="bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-md border p-6 shadow-xs duration-200 sm:max-w-6xl max-h-[95vh] overflow-y-hidden">
        <div className="border-b border-border/40 bg-background/95 backdrop-blur flex flex-col gap-2 text-center sm:text-left">
          <h2 className="text-lg font-mono leading-none font-semibold">
            {formInfo.title}
          </h2>
          <p className="text-muted-foreground text-sm">
            {formInfo.description}
          </p>
        </div>
        <div className="py-8 max-h-[80vh] overflow-y-auto">
          <div className="">{renderForm(formInfo.name)}</div>
        </div>
        <div className="absolute top-4 right-4">
          <div className="flex gap-2">
            <Link
              href={`/create/${formInfo.name}`}
              className={buttonVariants({
                variant: "ghost",
                size: "sm",
                className: "text-xs",
              })}
              target="_blank"
            >
              Open Full View
            </Link>
            <button
              data-slot="dialog-close"
              className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
              onClick={() => router.back()}
            >
              <XIcon />
              <span className="sr-only">Close</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
