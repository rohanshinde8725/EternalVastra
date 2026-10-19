import React from "react";

/**
 * Core Skeleton component with radiant shimmer effect and versatile variants.
 *
 * @param {Object} props
 * @param {"text" | "rectangular" | "rounded" | "circular"} [props.variant="rounded"]
 * @param {string | number} [props.width]
 * @param {string | number} [props.height]
 * @param {string} [props.className=""]
 * @param {React.ReactNode} [props.children]
 */
const Skeleton = ({
  variant = "rounded",
  width,
  height,
  className = "",
  style = {},
  children,
  ...rest
}) => {
  const variantClasses = {
    text: "h-3.5 w-full rounded-md",
    rectangular: "rounded-none",
    rounded: "rounded-xl",
    circular: "rounded-full aspect-square",
  };

  const inlineStyles = { ...style };
  if (width !== undefined) inlineStyles.width = typeof width === "number" ? `${width}px` : width;
  if (height !== undefined) inlineStyles.height = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      role="status"
      aria-label="Loading..."
      aria-busy="true"
      className={`skeleton-shimmer select-none ${variantClasses[variant] || "rounded-xl"} ${className}`}
      style={inlineStyles}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Skeleton;
