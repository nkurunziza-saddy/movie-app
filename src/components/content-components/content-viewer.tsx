"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { R2Image } from "../r2-image";
import { PlayIcon } from "lucide-react";

interface ContentViewerProps {
  content: {
    id: string;
    title: string;
    description: string;
    posterUrl: string;
    trailerUrl?: string;
    releaseYear: number;
    contentType: "movie" | "tv";
    genre?: string[];
  };
  dubber?: string;
}

export function ContentViewer({ content, dubber }: ContentViewerProps) {
  const [playTrailer, setPlayTrailer] = useState(false);

  const getYouTubeId = (url: string) => {
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
    );
    return match ? match[1] : null;
  };

  const youtubeId = content.trailerUrl
    ? getYouTubeId(content.trailerUrl)
    : null;

  return (
    <div className="relative h-[50vh] sm:h-[80vh] sm:mx-4 mt-6 sm:rounded-2xl overflow-hidden shadow-2xl">
      <div className="absolute inset-0">
        <R2Image
          objectKey={content.posterUrl}
          alt={content.title}
          fill
          className={cn(
            "object-cover transition-opacity duration-1000",
            playTrailer ? "opacity-0" : "opacity-100"
          )}
          priority
        />
        {youtubeId && (
          <div
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 pointer-events-none",
              playTrailer ? "opacity-100" : "opacity-0"
            )}
          >
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&loop=1&playlist=${youtubeId}`}
              title={`${content.title} Trailer`}
              className="w-full h-full"
              allow="autoplay; encrypted-media;"
              allowFullScreen
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
      </div>

      <div className="relative z-10 h-full flex items-end">
        <div className="w-full max-w-4xl px-2 sm:px-8 lg:px-16">
          <div className="max-w-2xl space-y-3 md:space-y-4 pb-8 md:pb-12">
            <h1 className="text-lg sm:text-3xl md:text-4xl lg:text-5xl font-black text-foreground leading-tight tracking-tight text-balance">
              {content.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="text-muted-foreground text-sm">
                {content.releaseYear}
              </span>
              <Badge variant="outline" className="text-xs">
                {content.contentType === "tv" ? "TV Show" : "Movie"}
              </Badge>
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed max-w-xl line-clamp-3 md:line-clamp-4">
              {content.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {content.genre?.slice(0, 3).map((genre) => (
                <Badge key={genre} variant="secondary" className="text-xs">
                  {genre}
                </Badge>
              ))}
            </div>
            {dubber && (
              <div className="flex space-y-2">
                <Badge key={dubber} variant="default" className="text-xs">
                  {dubber}
                </Badge>
              </div>
            )}

            {youtubeId && !playTrailer && (
              <div className="pt-4">
                <Button
                  onClick={() => setPlayTrailer(true)}
                  variant="outline"
                  size="sm"
                >
                  <PlayIcon fill="currentColor" />
                  Play Trailer
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
