import React from "react";
import Skeleton from "./Skeleton";

/**
 * Table Skeleton component that renders realistic shimmer rows inside a <tbody>,
 * with optional avatar/thumbnail simulation on the first column.
 *
 * @param {Object} props
 * @param {number} [props.rows=5] - Number of skeleton rows to render
 * @param {number} [props.columns=6] - Number of columns in each row
 * @param {boolean} [props.hasThumbnail=true] - Whether column 1 displays thumbnail/avatar + two text lines
 * @param {boolean} [props.standalone=false] - Whether to render full table wrapper
 */
export const TableSkeleton = ({
  rows = 5,
  columns = 6,
  hasThumbnail = true,
  standalone = false,
}) => {
  const rowList = Array.from({ length: rows }, (_, i) => i);
  const remainingCols = Array.from({ length: Math.max(columns - 1, 1) }, (_, i) => i);

  const renderRows = () => (
    <>
      {rowList.map((rowIdx) => (
        <tr
          key={rowIdx}
          className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
        >
          {/* Column 1: Optional Thumbnail + Title/Subtitle */}
          <td className="py-3.5 sm:py-4 px-3 sm:px-6">
            {hasThumbnail ? (
              <div className="flex items-center gap-3">
                <Skeleton
                  variant="rounded"
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl shrink-0"
                />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <Skeleton variant="text" className="h-4 w-32 sm:w-44" />
                  <Skeleton variant="text" className="h-3 w-20 sm:w-28" />
                </div>
              </div>
            ) : (
              <Skeleton variant="text" className="h-4 w-28" />
            )}
          </td>

          {/* Remaining Columns with varying realistic widths */}
          {remainingCols.map((colIdx) => {
            const isLast = colIdx === remainingCols.length - 1;
            const widths = ["w-20", "w-16", "w-24", "w-28", "w-14", "w-22"];
            const chosenWidth = widths[(rowIdx + colIdx) % widths.length];

            return (
              <td
                key={colIdx}
                className={`py-3.5 sm:py-4 px-3 sm:px-6 ${isLast ? "text-right" : ""}`}
              >
                <div
                  className={`flex items-center ${isLast ? "justify-end" : "justify-start"} gap-2`}
                >
                  {isLast ? (
                    <Skeleton
                      variant="rounded"
                      className="h-8 w-20 sm:w-24 rounded-lg"
                    />
                  ) : (
                    <Skeleton
                      variant={colIdx % 2 === 0 ? "rounded" : "text"}
                      className={`h-4 ${chosenWidth} ${colIdx % 2 === 0 ? "h-6 rounded-md" : ""}`}
                    />
                  )}
                </div>
              </td>
            );
          })}
        </tr>
      ))}
    </>
  );

  if (standalone) {
    return (
      <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200/90 shadow-xs">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {Array.from({ length: columns }, (_, i) => (
                <th key={i} className="py-3.5 px-4 sm:px-6">
                  <Skeleton variant="text" className="h-3.5 w-20" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">{renderRows()}</tbody>
        </table>
      </div>
    );
  }

  return renderRows();
};

export default TableSkeleton;
