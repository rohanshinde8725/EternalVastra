import React from "react";
import Skeleton from "./Skeleton";

/**
 * Review Card Skeleton for customer review sections in SareeDetail and User/Admin portals
 */
export const ReviewCardSkeleton = () => {
  return (
    <div className="bg-[#FCF8F5]/80 border border-[#EEDACB] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
      {/* Top Header: Avatar, Name & Stars */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Skeleton variant="circular" className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 border border-amber-200/50" />
          <div className="min-w-0 space-y-1.5">
            <div className="flex items-center gap-2">
              <Skeleton variant="text" className="h-4 w-28 sm:w-36" />
              <Skeleton variant="rounded" className="h-4 w-16 rounded-full" />
            </div>
            <Skeleton variant="text" className="h-3 w-20 sm:w-24" />
          </div>
        </div>

        {/* Rating Stars Badge */}
        <div className="flex items-center gap-1 bg-amber-50/70 border border-amber-200/50 px-2.5 py-1 rounded-lg shrink-0">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} variant="rounded" className="w-3 h-3 rounded-xs" />
            ))}
          </div>
          <Skeleton variant="text" className="h-3 w-6 ml-1" />
        </div>
      </div>

      {/* Product Tag if present */}
      <Skeleton variant="text" className="h-3 w-40" />

      {/* Review Comment Box */}
      <div className="bg-white/80 p-3.5 sm:p-4 rounded-xl border border-[#EEDACB]/40 space-y-2">
        <Skeleton variant="text" className="h-3.5 w-full" />
        <Skeleton variant="text" className="h-3.5 w-11/12" />
        <Skeleton variant="text" className="h-3.5 w-3/4" />
      </div>
    </div>
  );
};

export const ReviewSkeleton = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }, (_, i) => (
        <ReviewCardSkeleton key={i} />
      ))}
    </div>
  );
};

export default ReviewSkeleton;
