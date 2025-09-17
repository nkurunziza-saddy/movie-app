import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { requireAuth } from "@/lib/auth/server";
import { getBookmarks } from "@/lib/actions/bookmarks-action";
import {
  ContentCatalog,
  ContentCatalogSkeleton,
} from "@/components/content-components/content-catalog";
import { Suspense } from "react";

export default function BookmarksPage() {
  return (
    <div className="">
      <div className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-mono font-medium text-foreground">
                Your List
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Your saved movies for later
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-8">
        <Suspense fallback={<ContentCatalogSkeleton />}>
          <BookmarksCatalog />
        </Suspense>
      </div>
    </div>
  );
}

async function BookmarksCatalog() {
  const session = await requireAuth();
  const bookmarks = await getBookmarks(session.user.id);
  if (bookmarks.length === 0) {
    return (
      <Card>
        <CardContent>
          <div className="text-center py-8">
            <Bookmark className="size-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No bookmarks yet</p>
            <Button asChild className="mt-4">
              <Link href="/">Browse Movies</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <ContentCatalog isBookmark contents={bookmarks.map((b) => b.content)} />
  );
}
