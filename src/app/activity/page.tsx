import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Bookmark, Star, Calendar } from "lucide-react";
import {
  getUserStats,
  getUserRecentDownloads,
  getUserBookmarks,
} from "@/lib/db/actions/queries";
import Link from "next/link";
import {
  TextContainer,
  TextDescription,
  TextTitle,
} from "@/components/ui/text";

export default async function ActivityPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    redirect("/auth/signin");
  }

  const [stats, recentDownloads, bookmarks] = await Promise.all([
    getUserStats(session.user.id),
    getUserRecentDownloads(session.user.id, 5),
    getUserBookmarks(session.user.id, 6),
  ]);

  return (
    <div className="">
      <TextContainer>
        <TextTitle>Activity</TextTitle>
        <TextDescription>
          Manage your movies and account settings
        </TextDescription>
      </TextContainer>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="px-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Total Downloads</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDownloads}</div>
          </CardContent>
        </Card>

        <Card className="px-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Bookmarked Movies</CardTitle>
            <Bookmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookmarks}</div>
          </CardContent>
        </Card>

        <Card className="px-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Reviews Written</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReviews}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Downloads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Downloads</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/activity/downloads">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentDownloads.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No downloads yet
              </p>
            ) : (
              <div className="space-y-4">
                {recentDownloads.map((download) => {
                  if (!download.content) return null;
                  return (
                    <div
                      key={download.id}
                      className="flex items-center gap-3 p-3 border rounded-lg"
                    >
                      <img
                        src={
                          download.content?.posterUrl ||
                          `/placeholder.svg?height=60&width=40&query=${encodeURIComponent(
                            download.content?.title ?? ""
                          )}`
                        }
                        alt={download.content?.title}
                        className="w-10 h-15 rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">
                          {download.content?.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {download.downloadDate
                              ? new Date(
                                  download.downloadDate
                                ).toLocaleDateString()
                              : "Unknown"}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {download.movie?.quality ||
                              download.episode?.quality}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bookmarked Movies */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Bookmarked Movies</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/activity/bookmarks">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {bookmarks.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No bookmarks yet
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {bookmarks.map((bookmark) => {
                  if (!bookmark.content) return null;
                  return (
                    <Link
                      key={bookmark.id}
                      href={`/movie/${bookmark.content?.id}`}
                      className="group"
                    >
                      <div className="relative overflow-hidden rounded-lg">
                        <img
                          src={
                            bookmark.content?.posterUrl ||
                            `/placeholder.svg?height=200&width=150&query=${encodeURIComponent(
                              bookmark.content?.title ?? ""
                            )}`
                          }
                          alt={bookmark.content?.title}
                          className="w-full h-32 object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-foreground text-sm font-medium text-center px-2">
                            {bookmark.content?.title}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
