import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";

const Counter = ({
  target = 0,
  duration = 2.2,
  decimals = 0,
  prefix = "",
  suffix = "",
  className = "",
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    if (!isInView) return;

    let startTimestamp = null;
    const endValue = Number(target);
    const durationMs = duration * 1000;

    let animationFrameId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / durationMs, 1);

      // Smooth ease-out cubic curve
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = easeProgress * endValue;

      setCount(currentValue);

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        setCount(endValue);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);

    return () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isInView, target, duration]);

  const formattedValue =
    decimals > 0
      ? count.toFixed(decimals)
      : Math.floor(count).toLocaleString("en-IN");

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  );
};

export default Counter;
