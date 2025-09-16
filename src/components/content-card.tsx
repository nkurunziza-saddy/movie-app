"use client";

import Image from "next/image";
import Link from "next/link";
import { type ContentInterface } from "@/lib/db/schema";

interface ContentCardProps {
  content: ContentInterface;
}

export function ContentCard({ content }: ContentCardProps) {
  return (
    <div className=" relative border border-border/40 rounded-lg overflow-hidden bg-card/50">
      <Link className="absolute inset-0 z-10" href={`/content/${content.id}`} />
      <div className="relative aspect-[2/3] overflow-hidden bg-muted/30">
        <Image
          src={content.posterUrl || "/placeholder.jpg"}
          alt={content.title}
          width={200}
          height={300}
          className="object-cover w-full h-full"
        />
      </div>

      <div className="p-2 space-y-1">
        <div className="font-medium text-xs leading-tight">{content.title}</div>
        <div className="flex gap-2">
          <div className="text-xs text-muted-foreground">
            {content.releaseYear}
          </div>
        </div>
      </div>
    </div>
  );
}
