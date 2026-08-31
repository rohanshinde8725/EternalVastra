import { motion } from "framer-motion";

const FadeImage = ({ src, alt, className, viewport, ...props }) => {
  return (
    <motion.img
      src={src}
      alt={alt}
      className={className}
      initial={{
        opacity: 0,
        scale: 1.04,
        y: 20,
      }}
      whileInView={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      viewport={viewport || { once: true }}
      transition={{
        duration: 1.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ willChange: "transform, opacity" }}
      {...props}
    />
  );
};

export default FadeImage;