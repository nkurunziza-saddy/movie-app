"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

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
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (content.trailerUrl) {
        setShowTrailer(true);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [content.trailerUrl]);

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
    <div className="relative h-[80vh] mx-2 sm:mx-4 mt-6 rounded-2xl overflow-hidden shadow-2xl">
      {!showTrailer ? (
        <>
          <div className="absolute inset-0">
            <Image
              src={content.posterUrl || "/placeholder.svg"}
              alt={content.title}
              fill
              className="object-cover"
              priority
            />
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
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {youtubeId ? (
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=0&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
              title={`${content.title} Trailer`}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full bg-background flex items-center justify-center text-foreground">
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-semibold">
                  Trailer Not Available
                </h2>
                <p className="text-foreground/70">
                  Continue enjoying the poster
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
