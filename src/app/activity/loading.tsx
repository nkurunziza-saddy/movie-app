import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ActivityLoading() {
  return (
    <div className="">
      <div className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-7 w-32" />
              <Skeleton className="h-4 w-72 mt-2" />
            </div>
          </div>
        </div>
      </div>

      <div className="py-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="px-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-12" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-8 w-20" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 border rounded-lg"
                >
                  <Skeleton className="h-[60px] w-[40px]" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-8 w-20" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-9 gap-2">
                {Array.from({ length: 9 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-[2/3] rounded-md" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
