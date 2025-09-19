"use client";

import Image from "next/image";
import Link from "next/link";
import { type ContentInterface } from "@/lib/db/schema";
import { Bookmark } from "lucide-react";
import { R2Image } from "../r2-image";

interface ContentCardProps {
  content: ContentInterface;
  isBookmark?: boolean;
}

export function ContentCard({ content, isBookmark = false }: ContentCardProps) {
  return (
    <div className=" relative border border-border/40 rounded-md overflow-hidden bg-card/50">
      <Link className="absolute inset-0 z-10" href={`/content/${content.id}`} />
      <div className="relative aspect-[2/3] overflow-hidden bg-muted/30">
        <R2Image
          objectKey={content.posterKey}
          alt={content.title}
          width={200}
          height={300}
          className="object-cover w-full h-full"
        />
      </div>

      {isBookmark && (
        <Link
          href={`/content/${content.id}#download`}
          className="absolute top-2 right-2 bg-background/70 backdrop-blur rounded-md p-1 z-20"
        >
          <Bookmark className="w-4 h-4 text-foreground" />
        </Link>
      )}

      <div className="p-1.5 space-y-0.5">
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
