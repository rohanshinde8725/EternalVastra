import React from "react";
import Skeleton from "./Skeleton";

/**
 * Single Blog Card Skeleton
 */
export const BlogCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs flex flex-col justify-between h-full">
      {/* Thumbnail */}
      <div className="relative">
        <Skeleton variant="rectangular" className="w-full h-48 sm:h-56" />
        <div className="absolute top-3 left-3">
          <Skeleton variant="rounded" className="h-5 w-20 rounded-full bg-white/80" />
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <Skeleton variant="text" className="h-3 w-20" />
            <span className="text-slate-300">•</span>
            <Skeleton variant="text" className="h-3 w-16" />
          </div>

          <Skeleton variant="text" className="h-5 w-11/12" />
          <Skeleton variant="text" className="h-5 w-4/5" />

          <div className="space-y-1.5 pt-1">
            <Skeleton variant="text" className="h-3 w-full" />
            <Skeleton variant="text" className="h-3 w-10/12" />
          </div>
        </div>

        {/* Footer: Author info & Read More */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Skeleton variant="circular" className="w-8 h-8" />
            <Skeleton variant="text" className="h-3.5 w-24" />
          </div>
          <Skeleton variant="rounded" className="h-4 w-16 rounded-md" />
        </div>
      </div>
    </div>
  );
};

/**
 * Grid of Blog Card Skeletons
 */
export const BlogGridSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {Array.from({ length: count }, (_, i) => (
        <BlogCardSkeleton key={i} />
      ))}
    </div>
  );
};

/**
 * Full Blog Article Detail Skeleton
 */
export const BlogDetailSkeleton = () => {
  return (
    <div className="w-full bg-[#FEFAF8] min-h-screen py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Back Link & Category */}
        <div className="flex items-center justify-between">
          <Skeleton variant="text" className="h-4 w-28" />
          <Skeleton variant="rounded" className="h-6 w-24 rounded-full" />
        </div>

        {/* Article Title */}
        <div className="space-y-3">
          <Skeleton variant="text" className="h-8 sm:h-10 w-11/12" />
          <Skeleton variant="text" className="h-8 sm:h-10 w-4/5" />
        </div>

        {/* Meta Bar: Author avatar, date, read time */}
        <div className="flex items-center gap-4 py-3 border-y border-slate-200">
          <Skeleton variant="circular" className="w-12 h-12" />
          <div className="space-y-1.5 flex-1">
            <Skeleton variant="text" className="h-4 w-36" />
            <Skeleton variant="text" className="h-3 w-48" />
          </div>
          <Skeleton variant="rounded" className="h-8 w-20 rounded-lg" />
        </div>

        {/* Featured Image */}
        <Skeleton variant="rounded" className="w-full h-64 sm:h-96 rounded-2xl" />

        {/* Body Paragraphs */}
        <div className="space-y-4 pt-4">
          <Skeleton variant="text" className="h-4 w-full" />
          <Skeleton variant="text" className="h-4 w-full" />
          <Skeleton variant="text" className="h-4 w-11/12" />
          <Skeleton variant="text" className="h-4 w-full" />
          <Skeleton variant="text" className="h-4 w-4/5" />

          {/* Quote Block */}
          <div className="p-6 my-6 rounded-2xl bg-[#FCF8F5] border-l-4 border-[#74202D] space-y-2">
            <Skeleton variant="text" className="h-4 w-11/12" />
            <Skeleton variant="text" className="h-4 w-3/4" />
          </div>

          <Skeleton variant="text" className="h-4 w-full" />
          <Skeleton variant="text" className="h-4 w-full" />
          <Skeleton variant="text" className="h-4 w-5/6" />
        </div>
      </div>
    </div>
  );
};

export default BlogGridSkeleton;
