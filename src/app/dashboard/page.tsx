"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CreateDialogsInline } from "@/components/navbar-components/create-dialogs";
import { getDashboardStats } from "@/lib/actions/stats-query-action";
import { format } from "date-fns";
import {
  getPopularContent,
  getRecentContent,
} from "@/lib/actions/content-complex-filtering-action";

export default function DashboardPage() {
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: getDashboardStats,
  });

  const { data: recentContent, isLoading: isLoadingRecent } = useQuery({
    queryKey: ["recentContentDashboard"],
    queryFn: () => getRecentContent(5),
  });

  const { data: popularContent, isLoading: isLoadingPopular } = useQuery({
    queryKey: ["popularContentDashboard"],
    queryFn: () => getPopularContent(5),
  });

  if (isLoadingStats || isLoadingRecent || isLoadingPopular) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="">
      <div className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-mono font-medium text-foreground">
                Content Dashboard
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Overview of your content library and performance.
              </p>
            </div>
            <CreateDialogsInline />
          </div>
        </div>
      </div>

      <div className="py-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-card/50 border-border/40">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-mono text-muted-foreground">
                Total Movies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-mono font-bold">
                {stats?.totalMovies}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/40">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-mono text-muted-foreground">
                Total TV Shows
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-mono font-bold">
                {stats?.totalTvShows}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/40">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-mono text-muted-foreground">
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-mono font-bold">
                {stats?.totalUsers}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/50 border-border/40">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-mono text-muted-foreground">
                Total Downloads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-mono font-bold">
                {stats?.totalDownloads}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-card/50 border-border/40">
            <CardHeader>
              <CardTitle className="font-mono">Recently Added</CardTitle>
              <CardDescription>The latest movies and TV shows.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Uploaded</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentContent?.map((content) => (
                    <TableRow key={content.id}>
                      <TableCell className="font-medium">
                        {content.title}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{content.contentType}</Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(content.uploadDate!), "PPP")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/40">
            <CardHeader>
              <CardTitle className="font-mono">Most Popular</CardTitle>
              <CardDescription>Top downloaded content.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Downloads</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {popularContent?.map((content) => (
                    <TableRow key={content.id}>
                      <TableCell className="font-medium">
                        {content.title}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{content.contentType}</Badge>
                      </TableCell>
                      <TableCell>{content.downloadCount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
