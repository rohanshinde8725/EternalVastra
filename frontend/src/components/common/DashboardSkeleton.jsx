import React from "react";
import Skeleton from "./Skeleton";
import TableSkeleton from "./TableSkeleton";

/**
 * Dashboard Skeleton for user profile and admin dashboard overviews
 */
export const DashboardSkeleton = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-5 border border-[#EEDACB] shadow-[0_2px_15px_rgba(0,0,0,0.015)] flex items-center gap-4"
          >
            <Skeleton variant="circular" className="w-12 h-12 shrink-0 rounded-2xl" />
            <div className="flex-1 min-w-0 space-y-2">
              <Skeleton variant="text" className="h-3.5 w-24" />
              <Skeleton variant="text" className="h-6 w-16" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Content / Recent Orders Table Box */}
      <div className="bg-white rounded-2xl border border-[#EEDACB] p-5 sm:p-7 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton variant="text" className="h-5 w-36" />
            <Skeleton variant="text" className="h-3 w-56" />
          </div>
          <Skeleton variant="rounded" className="h-8 w-24 rounded-lg" />
        </div>

        {/* Table skeleton */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#EEDACB]/70">
                <th className="py-3 px-4"><Skeleton variant="text" className="h-3 w-16" /></th>
                <th className="py-3 px-4"><Skeleton variant="text" className="h-3 w-20" /></th>
                <th className="py-3 px-4"><Skeleton variant="text" className="h-3 w-24" /></th>
                <th className="py-3 px-4"><Skeleton variant="text" className="h-3 w-16" /></th>
                <th className="py-3 px-4"><Skeleton variant="text" className="h-3 w-20" /></th>
              </tr>
            </thead>
            <tbody>
              <TableSkeleton rows={4} columns={5} hasThumbnail={false} />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
