"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star, Download, Clock, HardDrive, Crown } from "lucide-react";
import { ContentInterface } from "@/lib/db/schema";

interface ContentCardProps {
  content: ContentInterface;
}

export function ContentCard({ content }: ContentCardProps) {
  return (
    <div className="relative border">
      <Link
        className="absolute inset-0 z-10"
        href={`/content/${content.id}`}
      ></Link>
      <div className="relative aspect-[2/3] overflow-hidden rounded-md bg-muted">
        <Image
          src={content.posterUrl || "/placeholder.svg"}
          alt={content.title}
          width={300}
          height={450}
          className="object-cover w-full h-full"
        />

        {content.isPremium && (
          <div className="absolute top-2 left-2">
            <Crown className="h-4 w-4 text-foreground" />
          </div>
        )}

        <div className="absolute top-2 right-2">
          <span className="text-xs text-foreground bg-background/50 px-1.5 py-0.5 rounded">
            {content.contentType === "movie" ? "Movie" : "Series"}
          </span>
        </div>
      </div>

      <div className="mt-3 space-y-2 px-2 py-1">
        <div>
          <div className="text-sm font-medium leading-tight hover:underline">
            {content.title}
          </div>

          <div className="text-xs text-muted-foreground mt-0.5">
            {content.releaseYear}
          </div>
        </div>
      </div>
    </div>
  );
}
