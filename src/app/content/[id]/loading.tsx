import { Skeleton } from "@/components/ui/skeleton";

export default function ContentLoading() {
  return (
    <div className="sm:max-w-[90rem] mx-auto">
      <div className="sticky top-4 z-50 flex justify-center pt-2">
        <Skeleton className="h-9 w-72 rounded-md" />
      </div>

      <div className="relative h-[80vh] mx-2 sm:mx-4 mt-6 rounded-2xl overflow-hidden bg-muted">
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-4xl px-8 lg:px-16">
            <div className="max-w-2xl space-y-6">
              <Skeleton className="h-12 sm:h-16 lg:h-20 w-3/4" />
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-20" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="download" className="max-w-4xl md:px-8 lg:px-16 py-4 md:py-12">
        <div className="flex flex-wrap items-center gap-4">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>

      <div className="md:px-8 lg:px-16 py-4 md:py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-card rounded-md p-6 border">
              <Skeleton className="h-6 w-24 mb-6" />
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-10" />
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="bg-card rounded-md p-6 border">
              <Skeleton className="h-8 w-40 mb-4" />
              <div className="space-y-6">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-4/5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
