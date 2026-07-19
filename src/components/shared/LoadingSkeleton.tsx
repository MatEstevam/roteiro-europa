import { Skeleton } from "@/components/ui/skeleton";

type LoadingSkeletonProps = {
  variant?: "card" | "list" | "page";
  count?: number;
};

export function LoadingSkeleton({
  variant = "card",
  count = 3,
}: LoadingSkeletonProps) {
  if (variant === "page") {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-36 shrink-0 rounded-lg" />
          ))}
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // card variant
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-lg border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-4 w-2/3" />
          <div className="space-y-2">
            <Skeleton className="h-16 w-full rounded" />
            <Skeleton className="h-16 w-full rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
