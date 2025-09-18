"use client";

import { useQuery } from "@tanstack/react-query";
import Image, { type ImageProps } from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

type R2ImageProps = Omit<ImageProps, "src"> & {
  objectKey: string | null | undefined;
};

export function R2Image({ objectKey, alt, ...props }: R2ImageProps) {
  const {
    data: src,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["r2-image", objectKey],
    queryFn: async () => {
      const response = await fetch(`/api/r2-url/${objectKey!}`);
      if (!response.ok) {
        throw new Error("Failed to fetch presigned URL");
      }
      const data = await response.json();
      return data.url;
    },
    enabled: !!objectKey,
    staleTime: 1000 * 60 * 60 * 24 * 6,
  });
  if (isLoading) {
    return <Skeleton className="w-full h-full" />;
  }

  if (isError || !src) {
    return (
      <div className="w-full h-full bg-muted flex items-center justify-center">
        <span className="text-xs text-muted-foreground">No Image</span>
      </div>
    );
  }

  return <Image src={src} alt={alt} {...props} />;
}
