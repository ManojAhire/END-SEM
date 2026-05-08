export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg dark:bg-white/5 bg-gray-200 ${className}`}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="glass-card p-4 space-y-3">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="glass-card p-4 space-y-2">
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-8 w-2/3" />
    </div>
  );
}
