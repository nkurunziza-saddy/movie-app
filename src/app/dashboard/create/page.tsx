import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreateContentPage() {
  return (
    <div className="">
      <div className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-mono font-medium text-foreground">
                Create Content
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Create new movies, seasons, or episodes.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Create Movie</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Create a new standalone movie.</p>
              <Link href="/dashboard/create/movie">
                <Button>Create Movie</Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Create Season</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Create a new season for an existing series.</p>
              <Link href="/dashboard/create/season">
                <Button>Create Season</Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Create Episode</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Create a new episode for an existing season.</p>
              <Link href="/dashboard/create/episode">
                <Button>Create Episode</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}