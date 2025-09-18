"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { R2Image } from "../r2-image";

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
}

export function ContentViewer({ content }: ContentViewerProps) {
  const [playTrailer, setPlayTrailer] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (content.trailerUrl && !playTrailer) {
      timer = setTimeout(() => {
        setPlayTrailer(true);
      }, 10000);
    }
    return () => clearTimeout(timer);
  }, [content.trailerUrl, playTrailer]);

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
    <div className="relative h-[80vh] mx-2 sm:mx-4 mt-6 rounded-2xl overflow-hidden shadow-2xl bg-background">
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
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=0&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&loop=1&playlist=${youtubeId}`}
              title={`${content.title} Trailer`}
              className="w-full h-full"
              allow="autoplay; encrypted-media;"
              allowFullScreen
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/60 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/40" />
      </div>

      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-4xl px-8 lg:px-16">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-xl sm:text-4xl lg:text-6xl font-black text-foreground leading-tight tracking-tight">
              {content.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="text-muted-foreground">
                {content.releaseYear}
              </span>
              <Badge variant="outline" className="text-xs">
                {content.contentType === "tv" ? "TV Show" : "Movie"}
              </Badge>
            </div>

            <p className="text-muted-foreground text-base lg:text-lg leading-relaxed max-w-xl">
              {content.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {content.genre?.slice(0, 3).map((genre) => (
                <Badge key={genre} variant="secondary" className="text-xs">
                  {genre}
                </Badge>
              ))}
            </div>

            {youtubeId && !playTrailer && (
              <div className="pt-4">
                <Button
                  onClick={() => setPlayTrailer(true)}
                  variant="secondary"
                  size="sm"
                >
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
