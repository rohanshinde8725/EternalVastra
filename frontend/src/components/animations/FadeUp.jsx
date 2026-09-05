import { motion } from "framer-motion";

const FadeUp = ({
  children,
  delay = 0,
  duration = 0.55,
  y = 24,
  className = "",
  viewport,
  ...props
}) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={viewport || { once: true, margin: "-40px" }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
      style={{ willChange: "transform, opacity" }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default FadeUp;