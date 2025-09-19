import {
  checkReview,
  getReviewCount,
  createReview,
  deleteReview,
} from "@/lib/actions/reviews-action";
import { useSession } from "@/lib/auth/auth-client";
import { reviewsTable } from "@/lib/db/schema";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useReviewCount() {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["review-count"],
    queryFn: async (): Promise<{ count: number }> => {
      const response = await getReviewCount(session!.user.id);
      if (typeof response !== "object" || typeof response.count !== "number") {
        throw new Error("Failed to fetch review count");
      }
      return response;
    },
    enabled: !!session,
    refetchInterval: 3000,
    staleTime: 0,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: typeof reviewsTable.$inferInsert) => {
      const response = await createReview({ data });

      return response.message;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["review-count"] });
      queryClient.invalidateQueries({ queryKey: ["review-status"] });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewId: string) => {
      const response = await deleteReview(reviewId);
      if (response !== "ok") {
        throw new Error(response);
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["review-count"] });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["review-status"] });
    },
  });
}

export function useIsReviewed(contentId: string) {
  const { data: session } = useSession();

  return useQuery({
    queryKey: ["review-status", contentId],
    queryFn: async () => {
      const response = await checkReview(contentId);
      if (typeof response !== "boolean") {
        throw new Error("Failed to check review status");
      }
      return response;
    },
    enabled: !!session && !!contentId,
    staleTime: 10000,
  });
}
