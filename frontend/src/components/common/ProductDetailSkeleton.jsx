import React from "react";
import Skeleton from "./Skeleton";
import { ProductCardSkeleton } from "./ProductCardSkeleton";

/**
 * Luxury Product Detail Skeleton matching the exact layout of SareeDetail.jsx
 */
const ProductDetailSkeleton = () => {
  return (
    <div className="w-full bg-[#FEFAF8] min-h-screen py-6 sm:py-10">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2 py-2">
          <Skeleton variant="text" className="h-4 w-12" />
          <span className="text-gray-300">/</span>
          <Skeleton variant="text" className="h-4 w-14" />
          <span className="text-gray-300">/</span>
          <Skeleton variant="text" className="h-4 w-20" />
          <span className="text-gray-300">/</span>
          <Skeleton variant="text" className="h-4 w-36" />
        </div>

        {/* Main Product Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Image Gallery (col-span-7) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Main Stage Image */}
            <div className="relative rounded-2xl overflow-hidden bg-white border border-gray-200/80 shadow-xs">
              <Skeleton
                variant="rectangular"
                className="w-full aspect-[3/4] sm:aspect-[4/5] max-h-[640px]"
              />
              {/* Floating tag placeholder */}
              <div className="absolute top-4 left-4">
                <Skeleton variant="rounded" className="h-6 w-24 rounded-full bg-white/70" />
              </div>
            </div>

            {/* Thumbnail Row */}
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {[1, 2, 3, 4, 5].map((idx) => (
                <Skeleton
                  key={idx}
                  variant="rounded"
                  className="w-18 h-22 sm:w-20 sm:h-24 rounded-xl shrink-0 border border-gray-200"
                />
              ))}
            </div>
          </div>

          {/* Right Column: Product Info & Actions (col-span-5) */}
          <div className="lg:col-span-5 space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-gray-200/80 shadow-xs">
            {/* Tag & SKU */}
            <div className="flex items-center justify-between">
              <Skeleton variant="rounded" className="h-5 w-20 rounded-full" />
              <Skeleton variant="text" className="h-4 w-24" />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Skeleton variant="text" className="h-7 sm:h-8 w-11/12" />
              <Skeleton variant="text" className="h-7 sm:h-8 w-3/4" />
            </div>

            {/* Rating Stars */}
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} variant="rounded" className="w-4 h-4 rounded-xs" />
                ))}
              </div>
              <Skeleton variant="text" className="h-4 w-28" />
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-baseline gap-3">
              <Skeleton variant="text" className="h-8 w-28" />
              <Skeleton variant="text" className="h-5 w-20" />
              <Skeleton variant="rounded" className="h-6 w-16 rounded-full" />
            </div>

            {/* Short Description */}
            <div className="space-y-2 pt-1">
              <Skeleton variant="text" className="h-3.5 w-full" />
              <Skeleton variant="text" className="h-3.5 w-11/12" />
              <Skeleton variant="text" className="h-3.5 w-4/5" />
            </div>

            {/* Highlights Chips */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} variant="rounded" className="h-10 rounded-xl" />
              ))}
            </div>

            {/* Quantity & CTA Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <Skeleton variant="rounded" className="h-11 w-32 rounded-xl" />
                <Skeleton variant="rounded" className="h-11 flex-1 rounded-xl" />
              </div>
              <Skeleton variant="rounded" className="h-12 w-full rounded-xl" />
            </div>

            {/* Trust Assurances */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 text-center">
                  <Skeleton variant="circular" className="w-10 h-10" />
                  <Skeleton variant="text" className="h-3 w-16" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Details & Specs Tabs Placeholder */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
          <div className="flex gap-4 border-b border-gray-100 pb-3">
            <Skeleton variant="rounded" className="h-8 w-32 rounded-lg" />
            <Skeleton variant="rounded" className="h-8 w-32 rounded-lg" />
            <Skeleton variant="rounded" className="h-8 w-32 rounded-lg" />
          </div>
          <div className="space-y-2.5 pt-2">
            <Skeleton variant="text" className="h-4 w-full" />
            <Skeleton variant="text" className="h-4 w-11/12" />
            <Skeleton variant="text" className="h-4 w-5/6" />
            <Skeleton variant="text" className="h-4 w-3/4" />
          </div>
        </div>

        {/* Related Products Skeleton Header + Row */}
        <div className="space-y-6 pt-6">
          <div className="flex justify-between items-center">
            <Skeleton variant="text" className="h-7 w-48" />
            <Skeleton variant="text" className="h-4 w-20" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <ProductCardSkeleton key={i} viewMode="grid" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;
