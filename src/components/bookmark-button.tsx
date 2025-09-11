"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkCheck, Check, Plus } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
  movieId: string;
  className?: string;
}

export function BookmarkButton({ movieId, className }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      checkBookmarkStatus();
    }
  }, [session, movieId]);

  const checkBookmarkStatus = async () => {
    try {
      const response = await fetch(`/api/bookmarks/check/${movieId}`);
      if (response.ok) {
        const { isBookmarked } = await response.json();
        setIsBookmarked(isBookmarked);
      }
    } catch (error) {
      console.error("Error checking bookmark status:", error);
    }
  };

  const toggleBookmark = async () => {
    if (!session) {
      toast.error("Please sign in to bookmark movies");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/bookmarks/${movieId}`, {
        method: isBookmarked ? "DELETE" : "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to update bookmark");
      }

      setIsBookmarked(!isBookmarked);
      toast.success(isBookmarked ? "Bookmark removed" : "Movie bookmarked!");
    } catch (error) {
      console.error("Bookmark error:", error);
      toast.error("Failed to update bookmark");
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
    return null;
  }

  return (
    <Button
      variant="outline"
      onClick={toggleBookmark}
      disabled={isLoading}
      className={cn("", className)}
    >
      {isBookmarked ? (
        <>
          <Check className="mr-2 h-5 w-5" />
          Added
        </>
      ) : (
        <>
          <Plus className="mr-2 h-5 w-5" />
          My List
        </>
      )}
    </Button>
  );
}
