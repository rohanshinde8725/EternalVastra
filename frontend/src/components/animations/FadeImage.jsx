import { motion } from "framer-motion";

const FadeImage = ({ src, alt, className, viewport, delay = 0, duration = 0.65, ...props }) => {
  return (
    <motion.img
      src={src}
      alt={alt}
      className={className}
      initial={{
        opacity: 0,
        scale: 1.02,
      }}
      whileInView={{
        opacity: 1,
        scale: 1,
      }}
      viewport={viewport || { once: true, margin: "-40px" }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      style={{ willChange: "transform, opacity" }}
      {...props}
    />
  );
};

export default FadeImage;