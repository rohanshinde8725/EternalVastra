import { motion } from "framer-motion";

const FadeUp = ({
  children,
  delay = 0,
  duration = 0.8,
  y = 30,
  viewport,
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
      viewport={viewport || { once: true }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
};

export default FadeUp;