"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Trash2 } from "lucide-react";
import { useSession } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { useCreateReview, useDeleteReview } from "@/hooks/use-reviews";

interface ReviewSectionProps {
  contentId: string;
  reviews: {
    id: string;
    createdAt: Date | null;
    rating: number;
    reviewText: string | null;
    userId: string;
    user: {
      name: string;
      username: string | null;
    };
  }[];
}

export function ReviewSection({ contentId, reviews }: ReviewSectionProps) {
  const [rating, setRating] = useState(0);
  const [optimisticReviews, setOptimisticReviews] = useState(reviews);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createReview = useCreateReview();
  const deleteReview = useDeleteReview();
  const { data: session } = useSession();

  useEffect(() => {
    setOptimisticReviews(reviews);
  }, [reviews]);

  const handleCreate = async () => {
    if (!session) {
      toast.error("Please sign in to leave a review");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    const tempId = `temp-${Date.now()}`;
    const newReview = {
      id: tempId,
      createdAt: new Date(),
      rating: rating,
      reviewText: reviewText,
      userId: session.user.id,
      user: {
        name: session.user.name ?? "",
        username: session.user.email ?? "",
      },
    };

    setOptimisticReviews((prev) => [...prev, newReview]);

    try {
      const result = await createReview.mutateAsync({
        contentId: contentId,
        rating: newReview.rating,
        reviewText: newReview.reviewText,
        userId: session!.user.id,
      });

      if (result === "ok") {
        toast.success("Review added!", {
          description: "Your review has been added.",
          duration: 2000,
        });
        setRating(0);
        setReviewText("");
      } else {
        toast.error("Error adding your review", {
          description: result,
        });
        setOptimisticReviews((prev) => prev.filter((r) => r.id !== tempId));
      }
    } catch (error) {
      setOptimisticReviews((prev) => prev.filter((r) => r.id !== tempId));
      const message =
        error instanceof Error ? error.message : "Failed to add review";
      toast.error("Error adding your review", {
        description: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    const previousReviews = optimisticReviews;
    setOptimisticReviews((prev) => prev.filter((r) => r.id !== reviewId));
    try {
      await deleteReview.mutateAsync(reviewId);
      toast.success("Review deleted");
    } catch (error) {
      toast.error("Failed to delete review");
      setOptimisticReviews(previousReviews);
    }
  };

  return (
    <div className="space-y-6 **:text-base">
      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          {session && (
            <div className="mb-6 p-4 border rounded-lg">
              <h3 className="font-semibold mb-3">Leave a Review</h3>
              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1"
                  >
                    <Star
                      className={`size-4 ${
                        star <= rating
                          ? "fill-amber-400 dark:fill-amber-600 text-amber-400 dark:text-amber-600"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <Textarea
                placeholder="Write your review (optional)..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="mb-3"
              />
              <Button
                onClick={handleCreate}
                disabled={isSubmitting || rating === 0}
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          )}

          <div className="space-y-4">
            {optimisticReviews.length === 0 ? (
              <p className="text-muted-foreground">
                No reviews yet. Be the first to review!
              </p>
            ) : (
              optimisticReviews.map((review) => (
                <div key={review.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`size-3.5 ${
                            star <= review.rating
                              ? "fill-amber-400 dark:fill-amber-600 text-amber-400 dark:text-amber-600"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-medium">
                      {review.user?.username ||
                        review.user?.name ||
                        "Anonymous"}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {review.createdAt &&
                        new Date(review.createdAt).toLocaleDateString()}
                    </span>
                    {session?.user.id === review.userId && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(review.id)}
                        className="ml-auto size-7"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    )}
                  </div>
                  {review.reviewText && (
                    <p className="text-muted-foreground">{review.reviewText}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
