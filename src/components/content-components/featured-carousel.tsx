"use client";

import Image from "next/image";
import { ContentInterface } from "@/lib/db/schema";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { R2Image } from "../r2-image";
import { Skeleton } from "../ui/skeleton";

interface FeatureCarouselProps {
  featuredContent: ContentInterface[];
}
export function FeaturedCarousel({ featuredContent }: FeatureCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (featuredContent.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredContent.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [currentIndex, featuredContent.length]);

  if (!featuredContent || featuredContent.length === 0) {
    return <FeaturedCarouselSkeleton />;
  }

  return (
    <div className="relative w-full h-[70vh] sm:h-[63vh] overflow-hidden rounded-lg">
      <div className="absolute inset-0">
        {featuredContent.map((content, index) => (
          <R2Image
            key={content.id}
            objectKey={content.posterKey}
            alt={content.title}
            fill
            className={cn(
              "object-cover transition-opacity duration-1000 ease-in-out",
              index === currentIndex ? "opacity-100" : "opacity-0"
            )}
            priority={index === 0}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 flex flex-col justify-end bg-gradient-to-t from-black/95 to-transparent p-4 sm:p-8">
        <div className="grid max-w-2xl">
          {featuredContent.map((content, index) => (
            <div
              key={content.id}
              className={cn(
                "col-start-1 row-start-1 transition-opacity duration-300 ease-in-out",
                currentIndex === index ? "opacity-100" : "opacity-0"
              )}
            >
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-2">
                <span className="text-foreground text-xs">
                  {content.releaseYear}
                </span>
                <span className="text-foreground text-xs">•</span>
                {content.genre?.map((t) => (
                  <Badge
                    key={t}
                    className="capitalize text-xs"
                    variant={"outline"}
                  >
                    {t}
                  </Badge>
                ))}
                <Badge variant={"secondary"} className="capitalize text-xs">
                  {content.status}
                </Badge>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-foreground mb-2 text-balance">
                {content.title}
              </h2>
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed max-w-md sm:max-w-xl line-clamp-2 sm:line-clamp-3">
                {content.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 sm:bottom-4 right-4 sm:right-8 flex gap-2">
        {featuredContent.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            aria-label={`View ${featuredContent[index].title}`}
            className={cn(
              "w-8 h-1 rounded-full transition-all duration-300",
              index === currentIndex ? "bg-primary" : "bg-foreground/30"
            )}
          />
        ))}
      </div>
    </div>
  );
}

export function FeaturedCarouselSkeleton() {
  return (
    <div className="w-full">
      <Skeleton className="relative h-32 rounded-lg bg-muted animate-pulse" />
    </div>
  );
}
