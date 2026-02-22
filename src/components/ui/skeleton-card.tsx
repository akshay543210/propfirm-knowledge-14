import { Skeleton } from "@/components/ui/skeleton";

const SkeletonCard = () => (
  <div className="rounded-xl glass-card-premium p-6 space-y-4 h-[480px]">
    {/* Header */}
    <div className="flex items-center gap-3">
      <Skeleton className="h-10 w-10 rounded-lg bg-muted/30" />
      <Skeleton className="h-5 w-32 bg-muted/30" />
      <Skeleton className="h-5 w-16 ml-auto rounded-full bg-muted/30" />
    </div>
    {/* Price */}
    <div className="flex items-center gap-2">
      <Skeleton className="h-7 w-20 bg-muted/30" />
      <Skeleton className="h-5 w-16 bg-muted/30" />
    </div>
    {/* Coupon */}
    <Skeleton className="h-14 w-full rounded-lg bg-muted/30" />
    {/* Description */}
    <Skeleton className="h-12 w-full bg-muted/30" />
    {/* Stats */}
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex justify-between">
          <Skeleton className="h-4 w-24 bg-muted/30" />
          <Skeleton className="h-4 w-16 bg-muted/30" />
        </div>
      ))}
    </div>
    {/* Buttons */}
    <div className="flex gap-2 mt-auto">
      <Skeleton className="h-10 flex-1 rounded-md bg-muted/30" />
      <Skeleton className="h-10 flex-1 rounded-md bg-muted/30" />
    </div>
  </div>
);

export { SkeletonCard };
