import {
  checkBookmark,
  getBookmarkCount,
  toggleBookmark,
} from "@/lib/actions/bookmarks-action";
import { useSession } from "@/lib/auth/auth-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useBookmarkCount() {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["bookmark-count"],
    queryFn: async (): Promise<{ count: number }> => {
      const response = await getBookmarkCount(session!.user.id);
      if (typeof response !== "object" || typeof response.count !== "number") {
        throw new Error("Failed to fetch bookmark count");
      }
      return response;
    },
    enabled: !!session,
    refetchInterval: 3000,
    staleTime: 0,
  });
}

export function useToggleBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contentId: string) => {
      const response = await toggleBookmark(contentId);
      if (
        typeof response === "undefined" ||
        typeof response.added !== "boolean"
      ) {
        throw new Error("Failed to toggle bookmark");
      }
      return response.added;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmark-count"] });
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      queryClient.invalidateQueries({ queryKey: ["bookmark-status"] });
    },
  });
}

export function useIsBookmarked(contentId: string) {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["bookmark-status", contentId],
    queryFn: async () => {
      const response = await checkBookmark(contentId);
      if (typeof response !== "boolean") {
        throw new Error("Failed to check bookmark status");
      }
      return response;
    },
    enabled: !!session && !!contentId,
    staleTime: 10000,
  });
}
