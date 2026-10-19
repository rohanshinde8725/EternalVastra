import React from "react";
import Skeleton from "./Skeleton";

/**
 * Product Card Skeleton that matches Eternal Vastra's product card layout
 * in both Grid (Seller / Shop grid) and List (Shop table) modes.
 */
export const ProductCardSkeleton = ({ viewMode = "grid" }) => {
  if (viewMode === "table" || viewMode === "list") {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 p-3.5 sm:p-4 rounded-xl border border-gray-200 bg-white shadow-xs">
        {/* Left: Thumbnail Image + Info */}
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
          <Skeleton
            variant="rounded"
            className="w-20 h-20 rounded-lg shrink-0"
          />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton variant="text" className="h-4 w-3/4" />
            <Skeleton variant="text" className="h-3 w-1/3" />
            <div className="flex items-center gap-2 pt-1">
              <Skeleton variant="text" className="h-4 w-16" />
              <Skeleton variant="text" className="h-3 w-12" />
            </div>
            <div className="flex items-center gap-1.5 pt-0.5">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} variant="rounded" className="w-3 h-3 rounded-xs" />
                ))}
              </div>
              <Skeleton variant="text" className="h-2.5 w-8" />
            </div>
          </div>
        </div>

        {/* Right: Button */}
        <div className="shrink-0 sm:self-center w-full sm:w-auto">
          <Skeleton variant="rounded" className="h-9 w-full sm:w-28 rounded-md" />
        </div>
      </div>
    );
  }

  // Default: Grid Card Skeleton
  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 bg-white shadow-xs flex flex-col justify-between h-full">
      {/* Top Image & Floating Badges */}
      <div className="relative overflow-hidden bg-gray-50">
        <Skeleton
          variant="rectangular"
          className="w-full h-[230px] sm:h-[300px] 2xl:h-[360px]"
        />

        {/* Simulated Floating Badges */}
        <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 right-2.5 sm:right-3 flex items-start justify-between pointer-events-none">
          {/* Tag pill */}
          <Skeleton variant="rounded" className="h-4 sm:h-5 w-16 sm:w-20 rounded-full bg-white/70" />

          {/* Action icon circles */}
          <div className="flex flex-col gap-1.5 sm:gap-2">
            <Skeleton variant="circular" className="h-8 w-8 sm:h-9 sm:w-9 bg-white/70" />
            <Skeleton variant="circular" className="h-8 w-8 sm:h-9 sm:w-9 bg-white/70" />
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          {/* Title lines */}
          <Skeleton variant="text" className="h-4 w-11/12" />
          <Skeleton variant="text" className="h-3.5 w-2/3" />

          {/* Price */}
          <div className="flex items-baseline gap-2 pt-1">
            <Skeleton variant="text" className="h-4 sm:h-5 w-18" />
            <Skeleton variant="text" className="h-3.5 w-14" />
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1.5 pt-1">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} variant="rounded" className="w-3 h-3 rounded-xs" />
              ))}
            </div>
            <Skeleton variant="text" className="h-3 w-10" />
          </div>
        </div>

        {/* Add to Cart button */}
        <Skeleton variant="rounded" className="h-9 sm:h-10 w-full rounded-md mt-2" />
      </div>
    </div>
  );
};

/**
 * Responsive Grid of Product Card Skeletons
 */
export const ProductGridSkeleton = ({ count = 8, viewMode = "grid", gridColsClass = "" }) => {
  const items = Array.from({ length: count }, (_, i) => i);

  if (viewMode === "table" || viewMode === "list") {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {items.map((i) => (
          <ProductCardSkeleton key={i} viewMode="table" />
        ))}
      </div>
    );
  }

  const defaultGridCols =
    gridColsClass ||
    "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4";

  return (
    <div className={`grid ${defaultGridCols} gap-3 sm:gap-4 md:gap-5`}>
      {items.map((i) => (
        <ProductCardSkeleton key={i} viewMode="grid" />
      ))}
    </div>
  );
};

export default ProductCardSkeleton;
