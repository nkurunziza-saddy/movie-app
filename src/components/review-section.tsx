"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";

interface Review {
  id: string;
  rating: number;
  reviewText: string | null;
  createdAt: Date;
  user: {
    username: string | null;
    email: string;
  };
}

interface ReviewSectionProps {
  movieId: string;
  reviews: Review[];
}

export function ReviewSection({ movieId, reviews }: ReviewSectionProps) {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();

  const submitReview = async () => {
    if (!session) {
      toast.error("Please sign in to leave a review");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/reviews/${movieId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating,
          reviewText: reviewText.trim() || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      toast.success("Review submitted!");
      setRating(0);
      setReviewText("");
      // Refresh the page to show new review
      window.location.reload();
    } catch (error) {
      console.error("Review error:", error);
      toast.error("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Reviews ({reviews.length})</CardTitle>
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
                      className={`h-5 w-5 ${
                        star <= rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
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
                onClick={submitReview}
                disabled={isSubmitting || rating === 0}
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          )}

          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-muted-foreground">
                No reviews yet. Be the first to review!
              </p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-medium">
                      {review.user?.username ||
                        review.user?.email.split("@")[0]}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
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
