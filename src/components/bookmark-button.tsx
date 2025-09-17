"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToggleBookmark } from "@/hooks/use-bookmarks";
import { toast } from "sonner";

interface BookmarkButtonProps {
  contentId: string;
  isBookmarked: boolean;
  showText?: boolean;
  className?: string;
}

export function BookmarkButton({
  contentId,
  isBookmarked,
  showText = true,
  className,
}: BookmarkButtonProps) {
  const [isOptimistic, setIsOptimistic] = useState(isBookmarked);
  const toggleBookmark = useToggleBookmark();

  const handleToggle = async () => {
    setIsOptimistic(!isOptimistic);

    try {
      const result = await toggleBookmark.mutateAsync(contentId);

      toast(result ? "Bookmarked!" : "Bookmark removed!", {
        description: result
          ? "This movie has been added to your list."
          : "This movie has been removed from your list.",
        duration: 2000,
      });
    } catch (error) {
      setIsOptimistic(isOptimistic);

      toast.error("Error updating your list", {
        description: "Failed to update bookmark",
      });
    }
  };

  return (
    <Button
      variant={isOptimistic ? "default" : "outline"}
      size="sm"
      onClick={handleToggle}
      disabled={toggleBookmark.isPending}
      className={cn("", className)}
    >
      <Bookmark
        className={cn(
          "mr-1 size-4",
          isOptimistic
            ? "fill-primary-foreground/90 text-primary-foreground/90"
            : "text-muted-foreground hover:text-foreground"
        )}
      />
      {showText && (
        <span
          className={cn(
            "hidden sm:block",
            isOptimistic
              ? "text-primary-foreground/90"
              : "text-muted-foreground"
          )}
        >
          My List
        </span>
      )}
    </Button>
  );
}
