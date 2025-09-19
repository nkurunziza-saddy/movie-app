import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DownloadsLoading() {
  return (
    <div className="">
      <div className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-4 w-64 mt-2" />
            </div>
          </div>
        </div>
      </div>

      <div className="py-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border rounded-lg"
                >
                  <Skeleton className="h-[80px] w-[60px] rounded" />
                  <div className="flex-1 min-w-0 space-y-2">
                    <Skeleton className="h-6 w-3/5" />
                    <Skeleton className="h-4 w-2/5" />
                  </div>
                  <Skeleton className="h-9 w-28" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
