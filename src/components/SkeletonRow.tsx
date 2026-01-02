export function SkeletonRow() {
  return (
    <div className="mb-8 md:mb-12">
      {/* Title skeleton */}
      <div className="px-4 md:px-8 mb-4">
        <div className="h-7 w-48 skeleton-shimmer rounded" />
      </div>
      
      {/* Cards skeleton */}
      <div className="px-4 md:px-8 flex gap-3 md:gap-4 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-[calc(45%-8px)] sm:w-[calc(33%-12px)] md:w-[calc(25%-12px)] lg:w-[calc(20%-14px)] xl:w-[calc(16.66%-16px)]"
          >
            <div className="aspect-video skeleton-shimmer rounded-lg" />
            <div className="mt-3 space-y-2">
              <div className="h-4 w-3/4 skeleton-shimmer rounded" />
              <div className="h-3 w-1/2 skeleton-shimmer rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
